package statics

var (
	StatusQueueName      = "UPDATE_STATUS"
	StatusQueueNameRetry = "UPDATE_STATUS_RETRY"
	StatusMapping        = map[string]string{
		"ready_to_pick":            "waiting_to_pick",
		"picking":                  "picking",
		"cancel":                   "canceled",
		"money_collect_picking":    "picking",
		"picked":                   "picking",
		"storing":                  "picking",
		"transporting":             "delivering",
		"sorting":                  "delivering",
		"delivering":               "delivering",
		"money_collect_delivering": "delivering",
		"delivered":                "delivery_success",
		"delivery_fail":            "delivery_fail",
		"waiting_to_return":        "waiting_to_return",
		"return":                   "waiting_to_return",
		"return_transporting":      "waiting_to_return",
		"return_sorting":           "waiting_to_return",
		"returning":                "returned",
		"return_fail":              "returned",
	}
)
