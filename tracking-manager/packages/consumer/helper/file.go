package helper

import (
	"encoding/base64"
	"fmt"
	"log/slog"
)

func GuessFileExtension(mimeType string) string {
	switch mimeType {
	case "image/jpeg":
		return "jpg"
	case "image/png":
		return "png"
	case "application/pdf":
		return "pdf"
	default:
		return "bin"
	}
}

func DecodeBase64(data string) ([]byte, error) {
	if data == "" {
		return nil, fmt.Errorf("empty base64 data")
	}

	fileBytes, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		slog.Error("Failed to decode base64 data", "err", err)
		return nil, err
	}

	return fileBytes, nil
}
