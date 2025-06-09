package models

import (
	"bytes"
	"consumer/pkg/database"
	"consumer/statics"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"os"
	"strconv"
	"time"

	"github.com/opensearch-project/opensearch-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetCurrentTime() time.Time {
	offsetStr := os.Getenv("TIMEZONE_OFFSET_HOURS")
	offset := 0
	if offsetStr != "" {
		if val, err := strconv.Atoi(offsetStr); err == nil {
			offset = val
		}
	}
	return time.Now().Add(time.Duration(offset) * time.Hour)
}

type addressOrderReq struct {
	Address  string `json:"address" bson:"address"`
	Ward     string `json:"ward" bson:"ward"`
	District string `json:"district" bson:"district"`
	Province string `json:"province" bson:"province"`
}

type infoAddressOrderReq struct {
	Name        string          `json:"name" bson:"name"`
	PhoneNumber string          `json:"phone_number" bson:"phone_number"`
	Email       string          `json:"email" bson:"email"`
	Address     addressOrderReq `json:"address" bson:"address"`
}

type Orders struct {
	// Id            primitive.ObjectID  `json:"_id" bson:"_id"`
	OrderId                 string              `json:"order_id" bson:"order_id"`
	TrackingId              string              `json:"tracking_id" bson:"tracking_id"`
	Order3PLCode            string              `json:"order_3pl_code" bson:"order_3pl_code"`
	Status                  string              `json:"status" bson:"status"`
	ShipperId               string              `json:"shipper_id" bson:"shipper_id"`
	ShipperName             string              `json:"shipper_name" bson:"shipper_name"`
	Product                 []ProductInfo       `json:"product" bson:"product"`
	Voucher                 []VoucherInfo       `json:"voucher" bson:"voucher"`
	PickFrom                infoAddressOrderReq `json:"pick_from" bson:"pick_from"`
	PickTo                  infoAddressOrderReq `json:"pick_to" bson:"pick_to"`
	SenderProvinceCode      int                 `json:"sender_province_code" bson:"sender_province_code"`
	SenderDistrictCode      int                 `json:"sender_district_code" bson:"sender_district_code"`
	SenderCommuneCode       int                 `json:"sender_commune_code" bson:"sender_commune_code"`
	ReceiverProvinceCode    int                 `json:"receiver_province_code" bson:"receiver_province_code"`
	ReceiverDistrictCode    int                 `json:"receiver_district_code" bson:"receiver_district_code"`
	ReceiverCommuneCode     int                 `json:"receiver_commune_code" bson:"receiver_commune_code"`
	GHNSenderProvinceCode   int                 `json:"ghn_sender_province_code" bson:"ghn_sender_province_code"`
	GHNSenderDistrictCode   int                 `json:"ghn_sender_district_code" bson:"ghn_sender_district_code"`
	GHNSenderCommuneCode    string              `json:"ghn_sender_commune_code" bson:"ghn_sender_commune_code"`
	GHNReceiverProvinceCode int                 `json:"ghn_receiver_province_code" bson:"ghn_receiver_province_code"`
	GHNReceiverDistrictCode int                 `json:"ghn_receiver_district_code" bson:"ghn_receiver_district_code"`
	GHNReceiverCommuneCode  string              `json:"ghn_receiver_commune_code" bson:"ghn_receiver_commune_code"`
	CreatedDate             time.Time           `json:"created_date" bson:"created_date"`
	UpdatedDate             time.Time           `json:"updated_date" bson:"updated_date"`
	CreatedBy               string              `json:"created_by" bson:"created_by"`
	DeliveryTime            time.Time           `json:"delivery_time" bson:"delivery_time"`
	DeliveryInstruction     string              `json:"delivery_instruction" bson:"delivery_instruction"`
	PaymentType             string              `json:"payment_type" bson:"payment_type"`
	PaymentStatus           string              `json:"payment_status" bson:"payment_status"`
	Weight                  float64             `json:"weight" bson:"weight"`
	ShippingFee             float64             `json:"shipping_fee" bson:"shipping_fee"`
	ProductFee              float64             `json:"product_fee" bson:"product_fee"`
	BasicTotalFee           float64             `json:"basic_total_fee" bson:"basic_total_fee"`
	EstimatedTotalFee       float64             `json:"estimated_total_fee" bson:"estimated_total_fee"`
	VoucherOrderDiscount    float64             `json:"voucher_order_discount" bson:"voucher_order_discount"`
	VoucherDeliveryDiscount float64             `json:"voucher_delivery_discount" bson:"voucher_delivery_discount"`
}

type ProductInfo struct {
	ProductId     string    `json:"product_id" bson:"product_id"`
	PriceId       string    `json:"price_id" bson:"price_id"`
	ProductName   string    `json:"product_name" bson:"product_name"`
	Unit          string    `json:"unit" bson:"unit"`
	Quantity      int       `json:"quantity" bson:"quantity"`
	Price         float64   `json:"price" bson:"price"`
	Weight        float64   `json:"weight" bson:"weight"`
	OriginalPrice float64   `json:"original_price" bson:"original_price"`
	Discount      float64   `json:"discount" bson:"discount"`
	ImagesPrimary string    `json:"images_primary" bson:"images_primary"`
	ExpiredDate   time.Time `json:"expired_date" bson:"expired_date"`
}

type VoucherInfo struct {
	VoucherId        string    `json:"voucher_id" bson:"voucher_id"`
	VoucherName      string    `json:"voucher_name" bson:"voucher_name"`
	Discount         float64   `json:"discount" bson:"discount"`
	MinOrderValue    float64   `json:"min_order_value" bson:"min_order_value"`
	MaxDiscountValue float64   `json:"max_discount_value" bson:"max_discount_value"`
	VoucherType      string    `json:"voucher_type" bson:"voucher_type"`
	ExpiredDate      time.Time `json:"expired_date" bson:"expired_date"`
}

type ProductRes struct {
	ProductId string `json:"product_id" bson:"product_id"`
	PriceId   string `json:"price_id" bson:"price_id"`
	Inventory int    `json:"inventory" bson:"inventory"`
	Sell      int    `json:"sell" bson:"sell"`
	Delivery  int    `json:"delivery" bson:"delivery"`
}

type VoucherRes struct {
	VoucherId string   `json:"voucher_id" bson:"voucher_id"`
	Inventory int      `json:"inventory" bson:"inventory"`
	Used      int      `json:"used" bson:"used"`
	UsedBy    []string `json:"used_by" bson:"used_by"`
}

type OrderRes struct {
	Id                      primitive.ObjectID  `json:"_id" bson:"_id"`
	OrderId                 string              `json:"order_id" bson:"order_id"`
	TrackingId              string              `json:"tracking_id" bson:"tracking_id"`
	Status                  string              `json:"status" bson:"status"`
	ShipperId               string              `json:"shipper_id" bson:"shipper_id"`
	ShipperName             string              `json:"shipper_name" bson:"shipper_name"`
	Product                 []ProductInfo       `json:"product" bson:"product"`
	Voucher                 []VoucherInfo       `json:"voucher" bson:"voucher"`
	PickFrom                infoAddressOrderReq `json:"pick_from" bson:"pick_from"`
	PickTo                  infoAddressOrderReq `json:"pick_to" bson:"pick_to"`
	SenderProvinceCode      int                 `json:"sender_province_code" bson:"sender_province_code"`
	SenderDistrictCode      int                 `json:"sender_district_code" bson:"sender_district_code"`
	SenderCommuneCode       int                 `json:"sender_commune_code" bson:"sender_commune_code"`
	ReceiverProvinceCode    int                 `json:"receiver_province_code" bson:"receiver_province_code"`
	ReceiverDistrictCode    int                 `json:"receiver_district_code" bson:"receiver_district_code"`
	ReceiverCommuneCode     int                 `json:"receiver_commune_code" bson:"receiver_commune_code"`
	CreatedDate             time.Time           `json:"created_date" bson:"created_date"`
	UpdatedDate             time.Time           `json:"updated_date" bson:"updated_date"`
	CreatedBy               string              `json:"created_by" bson:"created_by"`
	DeliveryTime            time.Time           `json:"delivery_time" bson:"delivery_time"`
	DeliveryInstruction     string              `json:"delivery_instruction" bson:"delivery_instruction"`
	PaymentType             string              `json:"payment_type" bson:"payment_type"`
	PaymentStatus           string              `json:"payment_status" bson:"payment_status"`
	Weight                  float64             `json:"weight" bson:"weight"`
	ShippingFee             float64             `json:"shipping_fee" bson:"shipping_fee"`
	ProductFee              float64             `json:"product_fee" bson:"product_fee"`
	BasicTotalFee           float64             `json:"basic_total_fee" bson:"basic_total_fee"`
	EstimatedTotalFee       float64             `json:"estimated_total_fee" bson:"estimated_total_fee"`
	VoucherOrderDiscount    float64             `json:"voucher_order_discount" bson:"voucher_order_discount"`
	VoucherDeliveryDiscount float64             `json:"voucher_delivery_discount" bson:"voucher_delivery_discount"`
}

type OrderToUpdate struct {
	OrderId             string `json:"order_id" bson:"order_id"`
	Status              string `json:"status" bson:"status"`
	ShipperId           string `json:"shipper_id" bson:"shipper_id"`
	ShipperName         string `json:"shipper_name" bson:"shipper_name"`
	PaymentStatus       string `json:"payment_status" bson:"payment_status"`
	DeliveryInstruction string `json:"delivery_instruction" bson:"delivery_instruction"`
}

type CreateOrderGHNResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		OrderCode      string  `json:"order_code"`
		SortCode       string  `json:"sort_code"`
		Return         int32   `json:"return"`
		CodFailedFee   float64 `json:"cod_failed_fee"`
		TotalFee       float64 `json:"total_fee"`
		MessageDisplay string  `json:"message_display"`
	} `json:"data"`
}

func (o *Orders) Create(ctx context.Context) (bool, string, error) {
	js, err := json.Marshal(o)
	if err != nil {
		slog.Error("Cannot parse to object", "body", string(js), "err", err.Error())
		return false, "", err
	}

	db := database.GetDatabase()
	collection := db.Collection("orders")
	o.CreatedDate = GetCurrentTime()
	o.UpdatedDate = o.CreatedDate
	if o.PaymentType == "COD" {
		o.PaymentStatus = "UNPAID"
	} else {
		o.PaymentStatus = "PAID"
	}

	res, err := collection.InsertOne(ctx, o)
	_id := ""
	if oid, ok := res.InsertedID.(primitive.ObjectID); ok {
		_id = oid.Hex()
	}

	slog.Info("insert order has successfully", "order_id", o.OrderId, "order", o, "id", _id, "res", string(js))
	if err != nil {
		slog.Error("Insert status failed", "order_id", o.OrderId, "order", o, "err", err)
	}
	return false, _id, nil
}

func buildSet(list []string) map[string]struct{} {
	set := make(map[string]struct{}, len(list))
	for _, v := range list {
		set[v] = struct{}{}
	}
	return set
}

func makeProductKey(productId, priceId string) string {
	return productId + "::" + priceId
}

func batchGetProductInventory(ctx context.Context, products []ProductInfo) (map[string]ProductRes, error) {
	db := database.GetDatabase()
	collection := db.Collection("products_inventory")

	// Chuẩn bị filter $or
	var filters []bson.M
	for _, p := range products {
		filters = append(filters, bson.M{
			"product_id": p.ProductId,
			"price_id":   p.PriceId,
		})
	}
	cursor, err := collection.Find(ctx, bson.M{"$or": filters})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	// Map theo productKey
	result := make(map[string]ProductRes)
	for cursor.Next(ctx) {
		var prod ProductRes
		if err := cursor.Decode(&prod); err != nil {
			continue
		}
		key := makeProductKey(prod.ProductId, prod.PriceId)
		result[key] = prod
	}
	return result, nil
}

func batchGetVoucherInventory(ctx context.Context, vouchers []VoucherInfo) (map[string]VoucherRes, error) {
	db := database.GetDatabase()
	collection := db.Collection("vouchers")

	var ids []string
	seen := map[string]struct{}{}
	for _, v := range vouchers {
		if _, ok := seen[v.VoucherId]; !ok {
			ids = append(ids, v.VoucherId)
			seen[v.VoucherId] = struct{}{}
		}
	}
	cursor, err := collection.Find(ctx, bson.M{"voucher_id": bson.M{"$in": ids}})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	result := make(map[string]VoucherRes)
	for cursor.Next(ctx) {
		var voucher VoucherRes
		if err := cursor.Decode(&voucher); err != nil {
			continue
		}
		result[voucher.VoucherId] = voucher
	}
	return result, nil
}

func stringJoin(items []string, sep string) string {
	if len(items) == 0 {
		return ""
	}
	result := items[0]
	for i := 1; i < len(items); i++ {
		result += sep + items[i]
	}
	return result
}

func CheckInventoryAndUpdateOrder(ctx context.Context, order *Orders) error {
	var (
		insufficientProducts []string
		expiredProducts      []string
		insufficientVouchers []string
		expiredVouchers      []string
		alreadyUsedVouchers  []string
	)

	productMap, err := batchGetProductInventory(ctx, order.Product)
	if err != nil {
		slog.Error("Không thể batch get product inventory", "err", err)
		return err
	}

	for i := range order.Product {
		p := &order.Product[i]
		key := makeProductKey(p.ProductId, p.PriceId)
		result, ok := productMap[key]
		if !ok {
			slog.Error("Không tìm thấy kho sản phẩm", "key", key)
			continue
		}

		if result.Inventory-result.Sell < p.Quantity {
			insufficientProducts = append(insufficientProducts, p.ProductName)
			continue
		}

		if !p.ExpiredDate.IsZero() && p.ExpiredDate.Before(GetCurrentTime()) && p.Discount > 0 {
			expiredProducts = append(expiredProducts, p.ProductName)
			continue
		}
	}

	if len(order.Voucher) > 0 {
		voucherMap, err := batchGetVoucherInventory(ctx, order.Voucher)
		if err != nil {
			slog.Error("Không thể batch get voucher inventory", "err", err)
			return err
		}

		for i := range order.Voucher {
			v := &order.Voucher[i]
			result, ok := voucherMap[v.VoucherId]
			if !ok {
				slog.Error("Không tìm thấy voucher", "voucher_id", v.VoucherId)
				continue
			}

			if result.Inventory-result.Used < 1 {
				insufficientVouchers = append(insufficientVouchers, v.VoucherName)
				continue
			}
			if !v.ExpiredDate.IsZero() && v.ExpiredDate.Before(GetCurrentTime()) && v.Discount > 0 {
				expiredVouchers = append(expiredVouchers, v.VoucherName)
				continue
			}
			usedBySet := buildSet(result.UsedBy)
			if _, ok := usedBySet[order.CreatedBy]; ok {
				alreadyUsedVouchers = append(alreadyUsedVouchers, v.VoucherName)
				continue
			}
		}
	}

	if len(insufficientProducts)+len(expiredProducts)+len(insufficientVouchers)+len(expiredVouchers)+len(alreadyUsedVouchers) > 0 {
		order.Status = "canceled"
		var reasons []string
		if len(insufficientProducts) > 0 {
			reasons = append(reasons, fmt.Sprintf("không đủ hàng: %s", stringJoin(insufficientProducts, ", ")))
		}
		if len(expiredProducts) > 0 {
			reasons = append(reasons, fmt.Sprintf("hết hạn giảm giá: %s", stringJoin(expiredProducts, ", ")))
		}
		if len(insufficientVouchers) > 0 {
			reasons = append(reasons, fmt.Sprintf("voucher hết số lượng: %s", stringJoin(insufficientVouchers, ", ")))
		}
		if len(expiredVouchers) > 0 {
			reasons = append(reasons, fmt.Sprintf("voucher hết hạn: %s", stringJoin(expiredVouchers, ", ")))
		}
		if len(alreadyUsedVouchers) > 0 {
			reasons = append(reasons, fmt.Sprintf("voucher đã dùng: %s", stringJoin(alreadyUsedVouchers, ", ")))
		}

		message := "Đơn hàng bị hủy do " + stringJoin(reasons, "; ")
		order.DeliveryInstruction = message

		slog.Info("Đơn hàng bị hủy", "order_id", order.OrderId, "lý do", message)
		return fmt.Errorf("%s", message)
	}

	return nil
}

func GetOrderByOrderId(ctx context.Context, order_id string) (*OrderRes, error) {
	db := database.GetDatabase()
	collection := db.Collection("orders")

	result := collection.FindOne(ctx, bson.M{"order_id": order_id})
	slog.Info("Findone order ", "res", result)
	if result.Err() != nil {
		slog.Error("Cannot get order by order_id ", "order_id", order_id, "err", result.Err())
		return nil, result.Err()
	}

	res := OrderRes{}
	if err := result.Decode(&res); err != nil {
		slog.Error("Cannot decode data ", "err", err)
		return nil, err
	}

	return &res, nil
}

func UpdateProductCount(ctx context.Context, products []ProductInfo, field string, modifier int) error {
	db := database.GetDatabase()
	productCol := db.Collection("products")
	inventoryCol := db.Collection("products_inventory")

	for _, p := range products {
		quantityChange := p.Quantity * modifier

		// Cập nhật trong collection "products"
		filter := bson.M{
			"product_id": p.ProductId,
			"prices": bson.M{
				"$elemMatch": bson.M{
					"price_id": p.PriceId,
				},
			},
		}
		update := bson.M{
			"$inc": bson.M{
				fmt.Sprintf("prices.$.%s", field): quantityChange,
			},
		}

		if _, err := productCol.UpdateOne(ctx, filter, update); err != nil {
			slog.Error("Không thể cập nhật sản phẩm", "field", field, "product_id", p.ProductId, "err", err)
			return fmt.Errorf("lỗi cập nhật %s cho sản phẩm %s: %w", field, p.ProductId, err)
		}

		// Cập nhật trong inventory
		inventoryFilter := bson.M{
			"product_id": p.ProductId,
			"price_id":   p.PriceId,
		}
		inventoryUpdate := bson.M{
			"$inc": bson.M{
				field: quantityChange,
			},
		}

		if _, err := inventoryCol.UpdateOne(ctx, inventoryFilter, inventoryUpdate); err != nil {
			slog.Error("Không thể cập nhật inventory", "field", field, "product_id", p.ProductId, "err", err)
			return fmt.Errorf("lỗi cập nhật %s trong inventory cho sản phẩm %s: %w", field, p.ProductId, err)
		}

		slog.Info("Cập nhật thành công", "product_id", p.ProductId, "field", field, "quantity", quantityChange)
	}

	return nil
}

func UpdateVoucherCount(ctx context.Context, vouchers []VoucherInfo, createdBy string, modifier int) error {
	db := database.GetDatabase()
	voucherCol := db.Collection("vouchers")

	for _, v := range vouchers {
		filter := bson.M{
			"voucher_id": v.VoucherId,
		}

		update := bson.M{
			"$inc": bson.M{
				"used": 1 * modifier,
			},
		}

		// Nếu thêm lượt dùng, thêm người dùng vào used_by
		if modifier > 0 {
			update["$addToSet"] = bson.M{
				"used_by": createdBy,
			}
		}

		// Nếu rollback lượt dùng, gỡ người dùng khỏi used_by
		if modifier < 0 {
			update["$pull"] = bson.M{
				"used_by": createdBy,
			}
		}

		if _, err := voucherCol.UpdateOne(ctx, filter, update); err != nil {
			slog.Error("Không thể cập nhật voucher", "voucher_id", v.VoucherId, "err", err)
			return fmt.Errorf("lỗi cập nhật voucher %s: %w", v.VoucherId, err)
		}

		slog.Info("Đã cập nhật voucher", "voucher_id", v.VoucherId, "modifier", modifier, "user", createdBy)
	}

	return nil
}

func (order *Orders) DeleteOrderRedis(ctx context.Context) error {
	err := database.DeleteOrder(ctx, order.OrderId)
	if err != nil {
		slog.Error("Không thể xóa order trong Redis", "order_id", order.OrderId, "err", err)
		return err
	}
	slog.Info("Order deleted successfully from Redis", "order_id", order.OrderId)
	return nil
}

func (o *OrderToUpdate) Update(ctx context.Context) (bool, string, error) {
	js, err := json.Marshal(o)
	if err != nil {
		slog.Error("Cannot parse to object", "body", string(js), "err", err.Error())
		return false, "", err
	}

	db := database.GetDatabase()
	collection := db.Collection("orders")

	filter := bson.M{"order_id": o.OrderId}
	update := bson.M{"$set": o}

	result := collection.FindOneAndUpdate(ctx, filter, update)
	if result.Err() != nil {
		slog.Error("Update failed", "order_id", o.OrderId, "order", o, "err", result.Err())
		return false, "", result.Err()
	}

	var order OrderRes
	if err := result.Decode(&order); err != nil {
		slog.Error("Failed to decode updated order", "order_id", o.OrderId, "order", o, "err", err)
		return false, "", err
	}

	slog.Info("Update successful", "order_id", o.OrderId, "order", o, "singleResult", order)
	return true, order.Id.Hex(), nil
}

func RemoveItemCartByOrder(ctx context.Context, orders Orders) bool {
	db := database.GetDatabase()
	collection := db.Collection("users")
	var userInfo bson.M

	userID, err := primitive.ObjectIDFromHex(orders.CreatedBy)
	if err == nil {
		err = collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&userInfo)
	}

	if err == nil && userInfo != nil {
		userIDStr := userID.Hex()
		for _, product := range orders.Product {
			err := RemoveProductFromCart(ctx, userIDStr, product.ProductId, product.PriceId)
			if err != nil {
				slog.Error("Failed to remove product from cart in MongoDB", "error", err)
				return false
			}
		}
		return true
	} else {
		for _, product := range orders.Product {
			database.RemoveCartItem(orders.CreatedBy, fmt.Sprintf("%s_%s", product.ProductId, product.PriceId))
		}
		return true
	}
}

func RemoveProductFromCart(ctx context.Context, userID string, productID string, priceID string) error {
	db := database.GetDatabase()
	collection := db.Collection("carts")

	var cartData bson.M
	err := collection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&cartData)
	if err != nil {
		return fmt.Errorf("carts not found: %w", err)
	}

	products, ok := cartData["products"].(primitive.A)
	if !ok {
		return fmt.Errorf("invalid products format")
	}

	var newProducts []bson.M
	for _, p := range products {
		item, ok := p.(bson.M)
		if !ok {
			continue
		}
		if item["product_id"] == productID && item["price_id"] == priceID {
			continue
		}
		newProducts = append(newProducts, item)
	}

	_, err = collection.UpdateOne(ctx, bson.M{"user_id": userID}, bson.M{"$set": bson.M{"products": newProducts}})
	if err != nil {
		return fmt.Errorf("failed to update cart: %w", err)
	}

	return nil
}

func searchES(ctx context.Context, client *opensearch.Client, index string, conditions map[string]interface{}) (map[string]interface{}, error) {
	mustConditions := make([]map[string]interface{}, 0, len(conditions))
	for key, value := range conditions {
		mustConditions = append(mustConditions, map[string]interface{}{
			"match": map[string]interface{}{key: value},
		})
	}

	query := map[string]interface{}{
		"query": map[string]interface{}{
			"bool": map[string]interface{}{"must": mustConditions},
		},
		"size": 1,
	}

	queryJSON, err := json.Marshal(query)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal query: %w", err)
	}

	res, err := client.Search(
		client.Search.WithContext(ctx),
		client.Search.WithIndex(index),
		client.Search.WithBody(bytes.NewReader(queryJSON)),
		client.Search.WithTrackTotalHits(true),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to execute search request: %w", err)
	}
	defer res.Body.Close()

	if res.IsError() {
		return nil, fmt.Errorf("error in search response: %s", res.Status())
	}

	var result map[string]interface{}
	if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to decode search response: %w", err)
	}

	hits, ok := result["hits"].(map[string]interface{})["hits"].([]interface{})
	if !ok || len(hits) == 0 {
		return nil, fmt.Errorf("no data found with conditions %v in index %s", conditions, index)
	}

	source, _ := hits[0].(map[string]interface{})["_source"].(map[string]interface{})
	return source, nil
}

func GetWardDistrict(ctx context.Context, client *opensearch.Client, ward int) (int, string, error) {
	conditions := map[string]interface{}{"code": ward}
	source, err := searchES(ctx, client, statics.WardIndex, conditions)
	if err != nil {
		slog.Warn("No results found", "ward", ward)
		return 0, "", fmt.Errorf("data location not found for ward: %d", ward)
	}
	if wardData, ok := source["ghn_code"].(string); ok {
		if districtData, ok := source["ghn_district_code"].(float64); ok {
			return int(districtData), wardData, nil
		}
	}
	return 0, "", fmt.Errorf("domestic_name not found for ward: %d", ward)
}

type ShiftData struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	FromTime int    `json:"from_time"`
	ToTime   int    `json:"to_time"`
}

type ShiftResponse struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    []ShiftData `json:"data"`
}

func GetFirstShiftID() (int, error) {
	data, err := database.GetShiftGHN()
	if err != nil {
		return 0, err
	}

	var shiftResp ShiftResponse
	if err := json.Unmarshal(data, &shiftResp); err != nil {
		return 0, fmt.Errorf("failed to parse shift response: %w", err)
	}

	if len(shiftResp.Data) == 0 {
		return 0, errors.New("no shift data returned")
	}

	return shiftResp.Data[0].ID, nil
}

func ConvertOrderToGHNPayload(order Orders, ctx context.Context) map[string]interface{} {
	client := database.GetESClient()
	fromDistrict, fromWard, err := GetWardDistrict(ctx, client, order.SenderCommuneCode)
	if err != nil {
		slog.Error("Cannot get from district and ward", "ward", order.SenderCommuneCode, "err", err)
		return nil
	}
	slog.Info("Get from district and ward", "fromDistrict", fromDistrict, "fromWard", fromWard)
	toDistrict, toWard, err := GetWardDistrict(ctx, client, order.SenderCommuneCode)
	if err != nil {
		slog.Error("Cannot get to district and ward", "ward", order.SenderCommuneCode, "err", err)
		return nil
	}
	slog.Info("Get to district and ward", "toDistrict", toDistrict, "toWard", toWard)

	totalQuantity := 0
	for _, p := range order.Product {
		totalQuantity += p.Quantity
	}
	length := 1
	width := 1
	height := 1
	if totalQuantity > 1 && totalQuantity <= 10 {
		length = 20
		width = 5
		height = 5
	}
	if totalQuantity > 10 {
		length = 30
		width = 20
		height = 20
	}

	shiftID, err := GetFirstShiftID()
	if err != nil {
		slog.Error("Cannot get shift ID from GHN", "err", err)
		return nil
	}

	items := make([]map[string]interface{}, 0, len(order.Product))
	for _, p := range order.Product {
		item := map[string]interface{}{
			"name":     p.ProductName,
			"code":     p.ProductId,
			"quantity": p.Quantity,
			"price":    int(p.Price),
			"length":   10,
			"width":    10,
			"height":   10,
			"weight":   int(p.Weight * 1000),
			"category": map[string]interface{}{
				"level1": p.Unit,
			},
		}
		items = append(items, item)
	}

	return map[string]interface{}{
		"payment_type_id": 2,
		"note":            order.DeliveryInstruction,
		"required_note":   "KHONGCHOXEMHANG",
		"from_name":       order.PickFrom.Name,
		"from_phone":      order.PickFrom.PhoneNumber,
		"from_address": fmt.Sprintf("%s, %s, %s, %s",
			order.PickFrom.Address.Address,
			order.PickFrom.Address.Ward,
			order.PickFrom.Address.District,
			order.PickFrom.Address.Province,
		),
		"from_ward_name":     order.PickFrom.Address.Ward,
		"from_district_name": order.PickFrom.Address.District,
		"from_province_name": order.PickFrom.Address.Province,
		"return_phone":       order.PickFrom.PhoneNumber,
		"return_address":     order.PickFrom.Address.Address,
		"return_district_id": fromDistrict,
		"return_ward_code":   fromWard,
		"client_order_code":  order.OrderId,
		"to_name":            order.PickTo.Name,
		"to_phone":           order.PickTo.PhoneNumber,
		"to_address": fmt.Sprintf("%s, %s, %s, %s",
			order.PickTo.Address.Address,
			order.PickTo.Address.Ward,
			order.PickTo.Address.District,
			order.PickTo.Address.Province,
		),
		"to_ward_code":   toWard,
		"to_district_id": toDistrict,
		"cod_amount":     order.EstimatedTotalFee,
		"content":        fmt.Sprintf("Đơn hàng %s", order.OrderId),
		"weight":         int(order.Weight * 1000), // Convert kg to gram
		"length":         length,
		"width":          width,
		"height":         height,
		// "pick_station_id":    fromWard,
		"deliver_station_id": nil,
		"insurance_value":    order.ProductFee - order.VoucherOrderDiscount,
		"service_id":         0,
		"service_type_id":    2,
		"coupon":             nil,
		"pick_shift":         []int{shiftID},
		"items":              items,
	}
}
