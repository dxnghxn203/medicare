package queue

import (
	"consumer/helper"
	"consumer/models"
	"consumer/statics"
	"context"
	"encoding/json"
	"fmt"
	"log/slog"

	"github.com/streadway/amqp"
)

type UpdateStatusQueue struct {
}

func (e *UpdateStatusQueue) process(msg []byte, ch *amqp.Channel, ctx context.Context) (bool, error) {
	var trackingReq models.TrackingReq
	err := json.Unmarshal(msg, &trackingReq)
	if err != nil {
		slog.Error("Failed to unmarshal tracking request", "err", err)
		return false, err
	}

	orderRes, err := models.GetOrderByOrderId(ctx, trackingReq.OrderId)
	if err != nil {
		slog.Error("Failed to get order by orderId", "orderId", trackingReq.OrderId, "err", err)
		return false, err
	}

	oldStatus := orderRes.Status

	validStatuses := []string{"canceled", "delivery_success", "returned"}
	isValidStatus := false
	for _, status := range validStatuses {
		if oldStatus == status {
			isValidStatus = true
			break
		}
	}
	if isValidStatus {
		slog.Info("Order already processed", "orderId", orderRes.OrderId, "status", oldStatus)
		return false, nil
	}

	newTracking := trackingReq.Mapping(orderRes.TrackingId)

	res, _, err := newTracking.Create(ctx)
	if err != nil {
		return res, err
	}

	if trackingReq.Status == "delivery_success" {
		orderRes.PaymentStatus = "PAID"
		err = models.UpdateProductCount(ctx, orderRes.Product, "delivery", 1)
		if err != nil {
			slog.Error("Lỗi cập nhật số lượng vận chuyển của sản phẩm", "err", err)
		}
	}

	if trackingReq.Status == "returned" || trackingReq.Status == "canceled" {
		orderRes.PaymentStatus = "UNPAID"
		err = models.UpdateProductCount(ctx, orderRes.Product, "sell", -1)
		if err != nil {
			slog.Error("Lỗi cập nhật số lượng đã bán của sản phẩm", "err", err)
		}
	}

	if trackingReq.Status == "canceled" {
		err = models.UpdateVoucherCount(ctx, orderRes.Voucher, orderRes.CreatedBy, -1)
		if err != nil {
			slog.Error("Lỗi cập nhật số lượng đã sử dụng voucher sau khi hủy đơn hàng", "err", err)
		}
	}

	orderToUpdate := &models.OrderToUpdate{
		OrderId:             orderRes.OrderId,
		Status:              trackingReq.Status,
		DeliveryInstruction: trackingReq.DeliveryInstruction,
		ShipperId:           trackingReq.ShipperId,
		ShipperName:         trackingReq.ShipperName,
		PaymentStatus:       orderRes.PaymentStatus,
	}

	res, id, err := orderToUpdate.Update(ctx)
	if err != nil {
		slog.Error("Failed to update order", "orderId", orderRes.OrderId, "err", err)
		return false, err
	}
	slog.Info("Successfully updated order from hook", "order_id", id, "status", trackingReq.Status)

	if oldStatus == trackingReq.Status {
		slog.Info("Order status is the same as before, no need to send email", "orderId", orderRes.OrderId, "status", oldStatus)
		return res, nil
	}

	displayStatus, ok := statics.StatusDisplayMapping[trackingReq.Status]
	if !ok {
		return res, fmt.Errorf("unknown GHN status: %s", trackingReq.Status)
	}

	err = helper.SendOrderStatusUpdateEmail(orderRes.PickTo.Email, orderRes.OrderId, displayStatus)
	if err != nil {
		slog.Error("Failed to send order status update email", "orderId", orderRes.OrderId, "err", err)
	}

	return res, err
}

func (e *UpdateStatusQueue) queueName() string {
	return statics.UpdateQueueName
}

func (e *UpdateStatusQueue) queueRetry() string {
	return statics.UpdateQueueNameRetry
}

func (e *UpdateStatusQueue) numberOfWorker() int {
	return 10
}

// NewExampleQueue NewExampleQueue
func NewUpdateStatusQueue() Queue {
	return &UpdateStatusQueue{}
}
