package database

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

var (
	// RedisClient là biến toàn cục để quản lý kết nối Redis
	RedisClient *redis.Client
)

// ConnectRedis khởi tạo kết nối đến Redis
func ConnectRedis() error {
	host := os.Getenv("REDIS_HOST")
	port := os.Getenv("REDIS_PORT")
	password := os.Getenv("REDIS_PASSWORD")

	if port == "" {
		port = "6379"
	}
	addr := fmt.Sprintf("%s:%s", host, port)

	RedisClient = redis.NewClient(&redis.Options{
		Addr:         addr,
		Password:     password,
		DB:           0,
		DialTimeout:  5 * time.Second,
		ReadTimeout:  3 * time.Second,
		WriteTimeout: 3 * time.Second,
		PoolSize:     50,
	})

	// Kiểm tra kết nối
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := RedisClient.Ping(ctx).Result()
	if err != nil {
		return fmt.Errorf("không thể kết nối đến Redis: %v", err)
	}

	slog.Info("Kết nối Redis thành công!")
	return nil
}

// GetRedisClient trả về client Redis để sử dụng
func GetRedisClient() *redis.Client {
	return RedisClient
}

// CloseRedis đóng kết nối đến Redis
func CloseRedis() {
	if RedisClient != nil {
		err := RedisClient.Close()
		if err != nil {
			slog.Error("Lỗi khi đóng kết nối Redis:", "err", err)
		} else {
			slog.Info("Đã đóng kết nối Redis.")
		}
	}
}

func GetOrderKey(orderID string) string {
	return fmt.Sprintf("order:%s", orderID)
}

func DeleteOrder(ctx context.Context, orderID string) error {
	key := GetOrderKey(orderID)
	_, err := RedisClient.Del(ctx, key).Result()
	return err
}

func cartKey(identifier string) string {
	return fmt.Sprintf("cart:%s", identifier)
}

func RemoveCartItem(identifier string, redisID string) {
	key := cartKey(identifier)
	RedisClient.HDel(context.Background(), key, redisID)
}
