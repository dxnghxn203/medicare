package statics

var (
	CreateOrderQueueName                = "CREATE_ORDER"
	CreateOrderQueueNameRetry           = "CREATE_ORDER_RETRY"
	UpdateQueueName                     = "UPDATE_STATUS"
	UpdateQueueNameRetry                = "UPDATE_STATUS_RETRY"
	ExtractDocumentQueueName            = "EXTRACT_DOCUMENT"
	ExtractDocumentQueueNameRetry       = "EXTRACT_DOCUMENT_RETRY"
	MaxRetry                      int64 = 3
	RetryInSeconds                      = "5"
	WardIndex                           = "stg_wards"
	StatusDisplayMapping                = map[string]string{
		"waiting_to_pick":   "Chờ lấy hàng",
		"picking":           "Đang lấy hàng",
		"delivering":        "Đang giao hàng",
		"delivery_success":  "Giao hàng thành công",
		"delivery_fail":     "Giao hàng thất bại",
		"waiting_to_return": "Chờ hoàn hàng",
		"returned":          "Đã hoàn hàng",
		"canceled":          "Hủy đơn",
	}
)
