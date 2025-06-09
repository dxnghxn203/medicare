import math

from app.core import elasticsearch
from app.core import response
from app.entities.fee.request import FeeGHNReq
from app.entities.fee.response import FeeRes
from app.helpers.constant import FEE_INDEX
from app.helpers.es_helpers import delete_index, insert_es_common
from app.models.location import query_es_data

from app.core import ghn

async def insert_fee_into_elasticsearch():
    await insert_es_common(FEE_INDEX, 'pricing.json')

async def delete_fee():
    delete_index(FEE_INDEX)

async def get_fee():
    data = await query_es_data(FEE_INDEX, {"query": {"match_all": {}}, "size": 1000})
    return response.SuccessResponse(data=data)

def calculate_shipping_fee(fee_data: dict, weight: float) -> float:
    pricing_list = fee_data.get("pricing", [])
    threshold_weight = fee_data.get("threshold_weight", 0)
    step_weight = fee_data.get("step_weight", 0.5)
    additional_price_per_step = fee_data.get("additional_price_per_step", 0)

    for pricing in pricing_list:
        if weight <= pricing["weight_less_than_equal"]:
            return pricing["price"]

    if weight > threshold_weight:
        steps = math.ceil((weight - threshold_weight) / step_weight)
        base_price = pricing_list[-1]["price"]
        return base_price + steps * additional_price_per_step

    return pricing_list[-1]["price"]


def get_fee_ghn(request: FeeGHNReq):
    try:
        return ghn.send_request_post(
            function="/shiip/public-api/v2/shipping-order/fee",
            payload=request.dict(),
            )
    except Exception as e:
        return None
