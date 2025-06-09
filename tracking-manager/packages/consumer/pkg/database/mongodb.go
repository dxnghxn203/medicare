package database

import (
	"context"
	"fmt"
	"log/slog"
	"net/url"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	DBClient *mongo.Client
	DB       *mongo.Database
)

// ConnectDB initializes a connection to MongoDB Atlas
func ConnectDB() error {
	mongo_user := os.Getenv("API_MONGO_USER")
	mongo_pass := url.QueryEscape(os.Getenv("API_MONGO_PWS"))
	mongo_host := os.Getenv("MONGO_HOST")
	mongo_db := os.Getenv("API_MONGO_DB")
	uri := fmt.Sprintf("mongodb+srv://%s:%s@%s/?retryWrites=true&w=majority", mongo_user, mongo_pass, mongo_host)

	// Cấu hình tùy chọn kết nối
	clientOptions := options.Client().
		ApplyURI(uri).
		SetConnectTimeout(10 * time.Second).
		SetMaxPoolSize(50)

	// Kết nối đến MongoDB
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		return fmt.Errorf("lỗi kết nối MongoDB: %v", err)
	}

	// Kiểm tra kết nối
	err = client.Ping(context.Background(), nil)
	if err != nil {
		return fmt.Errorf("không thể ping MongoDB: %v", err)
	}

	DBClient = client
	DB = client.Database(mongo_db)

	slog.Info("kết nối thành công MongoDB")
	return nil
}

// GetDatabase trả về reference của DB
func GetDatabase() *mongo.Database {
	return DB
}

// CloseDB đóng kết nối với MongoDB
func CloseDB() {
	if DBClient != nil {
		err := DBClient.Disconnect(context.Background())
		if err != nil {
			slog.Error("Lỗi khi đóng kết nối MongoDB:", "err", err)
		} else {
			slog.Info("Đã đóng kết nối MongoDB.")
		}
	}
}
