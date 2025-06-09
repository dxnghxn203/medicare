package server

import (
	"fmt"
	"log/slog"
	"os"
)

func Init() {
	r := NewRouter()
	port := os.Getenv("PORT")
	if port == "" {
		port = "10001"
	}
	slog.Info(fmt.Sprintf("Service running at port: %s", port))
	r.Run(fmt.Sprintf("0.0.0.0:%s", port))
}
