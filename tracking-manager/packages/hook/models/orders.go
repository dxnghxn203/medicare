package models

import (
	"fmt"
	"hook/statics"
)

type UpdateOrderStatusReq struct {
	OrderId             string `json:"ClientOrderCode" binding:"required"`
	Status              string `json:"Status" binding:"required"`
	ShipperName         string `json:"ShipperName"`
	DeliveryInstruction string `json:"Description"`
}

type UpdateOrderStatusMReq struct {
	OrderId             string `json:"order_id" bson:"order_id"`
	Status              string `json:"status" bson:"status"`
	ShipperName         string `json:"shipper_name" bson:"shipper_name"`
	DeliveryInstruction string `json:"delivery_instruction" bson:"delivery_instruction"`
}

func (req *UpdateOrderStatusReq) Mapping() (*UpdateOrderStatusMReq, error) {
	internalStatus, ok := statics.StatusMapping[req.Status]
	if !ok {
		return nil, fmt.Errorf("unknown GHN status: %s", req.Status)
	}

	model := &UpdateOrderStatusMReq{
		OrderId:             req.OrderId,
		Status:              internalStatus,
		ShipperName:         req.ShipperName,
		DeliveryInstruction: req.DeliveryInstruction,
	}
	return model, nil
}
