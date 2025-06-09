package main

import (
	"hook/server"
	"log/slog"

	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		slog.Error("Error loading .env file")
	}
}

func main() {
	server.Init()
}
