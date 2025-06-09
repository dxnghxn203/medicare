package recommendation

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"time"
)

type Client struct {
	BaseURL    string
	HTTPClient *http.Client
}

type ExtractRequest struct {
	FileData  []byte
	FileName  string
	RequestID string
	FileType  string
}

func NewClient(baseURL string) *Client {
	return &Client{
		BaseURL: baseURL,
		HTTPClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

func (c *Client) ExtractDocument(req ExtractRequest) error {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	fileField, err := writer.CreateFormFile("file", req.FileName)
	if err != nil {
		return fmt.Errorf("failed to create form file: %w", err)
	}

	_, err = io.Copy(fileField, bytes.NewReader(req.FileData))
	if err != nil {
		return fmt.Errorf("failed to copy file content: %w", err)
	}

	err = writer.WriteField("request_id", req.RequestID)
	if err != nil {
		return fmt.Errorf("failed to add request_id field: %w", err)
	}

	err = writer.Close()
	if err != nil {
		return fmt.Errorf("failed to close multipart writer: %w", err)
	}

	httpReq, err := http.NewRequest("POST", c.BaseURL+"/v1/extract", body)
	if err != nil {
		return fmt.Errorf("failed to create HTTP request: %w", err)
	}

	httpReq.Header.Set("Content-Type", writer.FormDataContentType())
	httpReq.Header.Set("Accept", "application/json")

	resp, err := c.HTTPClient.Do(httpReq)
	if err != nil {
		return fmt.Errorf("failed to send HTTP request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		respBody, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("extraction service returned error status %d: %s", resp.StatusCode, string(respBody))
	}

	return nil
}
