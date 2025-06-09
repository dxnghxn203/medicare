package queue

import (
	"consumer/helper"
	"consumer/pkg/recommendation"
	"consumer/statics"
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"os"
	"time"

	"github.com/streadway/amqp"
)

type ExtractDocumentRequest struct {
	RequestID string `json:"request_id"`
	FileName  string `json:"file_name"`
	FileData  string `json:"file_data"`
	FileType  string `json:"file_type"`
}

type ExtractDocumentQueue struct {
	client *recommendation.Client
}

func (e *ExtractDocumentQueue) process(msg []byte, ch *amqp.Channel, ctx context.Context) (bool, error) {
	var extractReq ExtractDocumentRequest
	err := json.Unmarshal(msg, &extractReq)
	if err != nil {
		slog.Error("Failed to unmarshal extract document request", "err", err)
		return false, err
	}

	if extractReq.FileData == "" {
		slog.Error("Missing file data in extract document request")
		return false, fmt.Errorf("missing file data")
	}

	if extractReq.RequestID == "" {
		extractReq.RequestID = fmt.Sprintf("req_%d", time.Now().UnixNano())
	}

	fileBytes, err := helper.DecodeBase64(extractReq.FileData)
	if err != nil {
		slog.Error("Failed to decode file data", "err", err)
		return false, err
	}

	fileName := extractReq.FileName
	if fileName == "" {
		fileName = fmt.Sprintf("%s.%s", extractReq.RequestID, helper.GuessFileExtension(extractReq.FileType))
	}

	err = e.client.ExtractDocument(recommendation.ExtractRequest{
		FileData:  fileBytes,
		FileName:  fileName,
		RequestID: extractReq.RequestID,
		FileType:  extractReq.FileType,
	})

	if err != nil {
		slog.Error("Failed to send extraction request", "requestID", extractReq.RequestID, "err", err)
		return true, err
	}

	slog.Info("Successfully sent document extraction request",
		"requestID", extractReq.RequestID,
		"fileName", fileName)
	return false, nil
}

func (e *ExtractDocumentQueue) queueName() string {
	return statics.ExtractDocumentQueueName
}

func (e *ExtractDocumentQueue) queueRetry() string {
	return statics.ExtractDocumentQueueNameRetry
}

func (e *ExtractDocumentQueue) numberOfWorker() int {
	return 5
}

func NewExtractDocumentQueue() Queue {
	client := recommendation.NewClient(os.Getenv("RECOMMENDATION_API_URL"))
	return &ExtractDocumentQueue{
		client: client,
	}
}
