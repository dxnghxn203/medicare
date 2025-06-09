package api

import (
	"hook/pkg/rabbitmq"

	"github.com/gin-gonic/gin"
)

type API interface {
	UpdateStatus(c *gin.Context)
}

func NewAPI(sQueue *rabbitmq.RabbitMQ) API {
	return &MedicareAPI{statusQueue: sQueue}
}
