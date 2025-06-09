package api

import (
	"bytes"
	"encoding/json"
	"hook/models"
	"hook/pkg/rabbitmq"
	"io"
	"log/slog"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type MedicareAPI struct {
	statusQueue *rabbitmq.RabbitMQ
}

func (spx *MedicareAPI) UpdateStatus(c *gin.Context) {
	bodyBytes, err := c.GetRawData()
	if err != nil {
		slog.Error("can't read raw body", "err", err, "time", time.Now().Format(time.RFC3339Nano))
		c.JSON(http.StatusOK, gin.H{"result": false, "msg": "invalid body"})
		return
	}

	slog.Info("receive raw body SC", "body", string(bodyBytes), "time", time.Now().Format(time.RFC3339Nano))

	c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

	var model models.UpdateOrderStatusReq
	if err := c.ShouldBindJSON(&model); err != nil {
		slog.Error("can't parser req body err SC", "err", err)
		c.JSON(http.StatusOK, gin.H{"result": false, "msg": err.Error()})
		return
	}
	j, _ := json.Marshal(model)
	slog.Info("receive the msg SC", "mess", string(j), "time", time.Now().Format(time.RFC3339Nano))

	modelMedicare, err := model.Mapping()
	if err != nil {
		slog.Error("push msg error SC", "error", err.Error(), "time", time.Now().Format(time.RFC3339Nano))
		c.JSON(http.StatusOK, gin.H{"result": false, "msg": err.Error()})
		return
	}

	if err := spx.statusQueue.Publish(modelMedicare); err != nil {
		slog.Error("push msg error SC", "mess", err.Error(), "time", time.Now().Format(time.RFC3339Nano))
		c.JSON(http.StatusOK, gin.H{"result": false, "msg": "service unavailable"})
		return
	}

	j, _ = json.Marshal(modelMedicare)
	slog.Info("push msg done SC", "mess", string(j), "time", time.Now().Format(time.RFC3339Nano))
	c.JSON(http.StatusOK, gin.H{"result": true, "msg": "Cập nhật trạng thái đơn hàng thành công"})
}
