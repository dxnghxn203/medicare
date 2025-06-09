package models

import (
	"consumer/pkg/database"
	"context"
	"encoding/json"
	"log/slog"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Tracking struct {
	OrderId             string    `json:"order_id" bson:"order_id"`
	TrackingId          string    `json:"tracking_id" bson:"tracking_id"`
	Status              string    `json:"status" bson:"status"`
	ShipperId           string    `json:"shipper_id" bson:"shipper_id"`
	ShipperName         string    `json:"shipper_name" bson:"shipper_name"`
	CreatedDate         time.Time `json:"created_date" bson:"created_date"`
	UpdatedDate         time.Time `json:"updated_date" bson:"updated_date"`
	DeliveryInstruction string    `json:"delivery_instruction" bson:"delivery_instruction"`
}

type TrackingReq struct {
	OrderId             string `json:"order_id" bson:"order_id"`
	Status              string `json:"status" bson:"status"`
	ShipperId           string `json:"shipper_id" bson:"shipper_id"`
	ShipperName         string `json:"shipper_name" bson:"shipper_name"`
	DeliveryInstruction string `json:"delivery_instruction" bson:"delivery_instruction"`
}

func (r *TrackingReq) Mapping(trackingId string) *Tracking {
	return &Tracking{
		TrackingId:          trackingId,
		OrderId:             r.OrderId,
		Status:              r.Status,
		DeliveryInstruction: r.DeliveryInstruction,
		ShipperId:           r.ShipperId,
		ShipperName:         r.ShipperName,
	}
}

func (t *Tracking) Create(ctx context.Context) (bool, string, error) {
	js, err := json.Marshal(t)
	if err != nil {
		slog.Error("Cannot parse to object", "body", string(js), "err", err.Error())
		return false, "", err
	}

	db := database.GetDatabase()
	collection := db.Collection("trackings")
	t.CreatedDate = time.Now().Add(7 * time.Hour)
	t.UpdatedDate = t.CreatedDate
	res, err := collection.InsertOne(ctx, t)
	if err != nil {
		slog.Error("Insert tracking failed", "order_id", t.OrderId, "tracking", t, "err", err)
		return false, "", err
	}

	// res.InsertedID
	_id := ""
	if oid, ok := res.InsertedID.(primitive.ObjectID); ok {
		_id = oid.Hex()
	}
	slog.Info("insert tracking has successfully", "order_code", t.OrderId, "id", _id)

	return true, _id, nil
}
