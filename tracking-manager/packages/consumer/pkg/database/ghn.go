package database

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

func CallGHNAPI(method, endpoint string, payload interface{}, headers map[string]string) ([]byte, error) {
	client := &http.Client{Timeout: 5 * time.Second}

	var body io.Reader
	if payload != nil {
		data, err := json.Marshal(payload)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal payload: %w", err)
		}
		body = bytes.NewBuffer(data)
	}

	req, err := http.NewRequest(method, os.Getenv("GHN_API_URL")+endpoint, body)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	for k, v := range headers {
		req.Header.Set(k, v)
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("GHN API request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBody, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("GHN API error: status=%d body=%s", resp.StatusCode, string(respBody))
	}

	return io.ReadAll(resp.Body)
}

func CreateOrderGHN(payload interface{}) ([]byte, error) {
	headers := map[string]string{
		"Content-Type": "application/json",
		"Token":        os.Getenv("GHN_TOKEN"),
		"ShopId":       os.Getenv("GHN_SHOP_ID"),
	}

	return CallGHNAPI("POST", "/shiip/public-api/v2/shipping-order/create", payload, headers)
}

func GetShiftGHN() ([]byte, error) {
	headers := map[string]string{
		"token": os.Getenv("GHN_TOKEN"),
	}

	return CallGHNAPI("GET", "/shiip/public-api/v2/shift/date", nil, headers)
}
