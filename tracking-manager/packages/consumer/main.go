package main

import (
	"consumer/pkg/database"
	"consumer/queue"
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"

	log "github.com/sirupsen/logrus"
	"github.com/subosito/gotenv"
)

func init() {
	err := gotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	log.SetFormatter(&log.JSONFormatter{})
	log.SetOutput(os.Stdout)
}

func main() {
	quit := make(chan bool)
	manager := &queue.Manager{Quit: quit}
	ctx, cancelF := context.WithCancel(context.Background())
	err := database.ConnectDB()
	if err != nil {
		slog.Error("Không thể kết nối đến mongodb.")
		slog.Info(err.Error())
	}

	err = database.ConnectES()
	if err != nil {
		slog.Error("Không thể kết nối đến elastic.")
		slog.Info(err.Error())
	}

	err = database.ConnectRedis()
	if err != nil {
		slog.Error("Không thể kết nối đến redis.")
		slog.Info(err.Error())
	}

	wg := sync.WaitGroup{}
	manager.Run(
		ctx,
		cancelF,
		&wg,
		queue.NewCreateOrderQueue(),
		queue.NewUpdateStatusQueue(),
		queue.NewExtractDocumentQueue(),
	)
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigs
		log.Info("worker is shutting down")
		defer close(sigs)
		cancelF()
		quit <- true
	}()

	go startHTTPServer()

	<-quit
	wg.Wait()
}

func startHTTPServer() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "RabbitMQ Worker is running!")
	})
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "OK")
	})

	port := "10000"

	fmt.Println("INFO: HTTP server đang chạy trên cổng " + port)
	log.Info("HTTP server đang chạy trên cổng " + port)

	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal("Không thể khởi chạy HTTP server:", err)
	}

}
