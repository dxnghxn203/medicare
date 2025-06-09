import random
import string
from datetime import datetime
from app.entities.order.request import InfoAddressOrderReq, AddressOrderReq


def get_create_order_queue():
    return "CREATE_ORDER"

def get_update_status_queue():
    return "UPDATE_STATUS"

def get_extract_document_queue():
    return "EXTRACT_DOCUMENT"

def generate_random_string(length: int) -> str:
    charset = string.ascii_uppercase + string.digits
    return ''.join(random.choices(charset, k=length))

def generate_id(prefix: str) -> str:
    random_id = generate_random_string(3)
    timestamp = int(datetime.utcnow().timestamp())
    return f"{prefix}{random_id}{timestamp}"

prefix = "stg"
CITY_INDEX = f"{prefix}_cities"
DISTRICT_INDEX = f"{prefix}_districts"
WARD_INDEX = f"{prefix}_wards"
REGION_INDEX = f"{prefix}_regions"
FEE_INDEX = f"{prefix}_fee"
TIME_INDEX = f"{prefix}_time"

PAYMENT_COD = "COD"
PAYMENT_TP_BANK_QR = "TPBANK_QR"
PAYMENT_BIDV_BANK_QR = "BIDV_QR"
BANK_IDS = {
    PAYMENT_TP_BANK_QR: "TPB",
    PAYMENT_BIDV_BANK_QR: "BIDV"
}
special_cities = {
    79: True, #TP. Hồ Chí Minh
	1:  True, #TP. Hà Nội
	48: True, #TP. Đà Nẵng
}

WAREHOUSE_ADDRESS = InfoAddressOrderReq(
    name="Kho trung tâm",
    phone_number="0937837564",
    email="tuannguyen23823@gmail.com",
    address=AddressOrderReq(
        address="Đường 1",
        ward="Phường 26",
        district="Quận Bình Thạnh",
        province="Thành phố Hồ Chí Minh"
    )
)

SENDER_PROVINCE_CODE = 79
SENDER_DISTRICT_CODE = 765
SENDER_COMMUNE_CODE = 26914

