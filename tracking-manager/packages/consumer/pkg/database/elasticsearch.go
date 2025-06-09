package database

import (
	"crypto/tls"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
	"time"

	opensearch "github.com/opensearch-project/opensearch-go"
)

var (
	OSClient *opensearch.Client
)

func ConnectES() error {
	address := fmt.Sprintf("%s:%s", os.Getenv("ES_HOST"), os.Getenv("ES_PORT"))

	cfg := opensearch.Config{
		Addresses: []string{address},
		Username:  os.Getenv("ES_USER"),
		Password:  os.Getenv("ES_PW"),
		Transport: &http.Transport{
			MaxIdleConnsPerHost:   10,
			ResponseHeaderTimeout: 5 * time.Second,
			DialContext:           (&net.Dialer{Timeout: 5 * time.Second}).DialContext,
			TLSClientConfig: &tls.Config{
				MinVersion:         tls.VersionTLS12,
				InsecureSkipVerify: true,
			},
		},
	}

	client, err := opensearch.NewClient(cfg)
	if err != nil {
		slog.Error("Cannot create elastic client", "err", err)
		return err
	}

	// Kiểm tra kết nối
	res, err := client.Info()
	if err != nil {
		slog.Error("Elastic connection failed", "err", err)
		return err
	}
	defer res.Body.Close()

	slog.Info("Connected to Elasticsearch/OpenSearch!")
	OSClient = client
	return nil
}

func GetESClient() *opensearch.Client {
	return OSClient
}
