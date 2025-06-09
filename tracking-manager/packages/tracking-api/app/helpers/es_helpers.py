import json
import os
from typing import List, Callable, Type, Any, Union

import pandas as pd
from opensearchpy import helpers
from starlette.status import HTTP_400_BAD_REQUEST

from app.core import logger, response
from app.core.elasticsearch import es_client
from app.entities.fee.request import FeeReq
from app.entities.fee.response import FeeRes
from app.entities.location.response import City, District, Ward, Region
from app.entities.time.request import TimeReq
from app.entities.time.response import TimeRes
from app.helpers.constant import CITY_INDEX, DISTRICT_INDEX, WARD_INDEX, REGION_INDEX, TIME_INDEX, FEE_INDEX


def extract_location(df: pd.DataFrame, columns_map: dict, model_class: Type) -> List[dict]:
    try:
        df_clean = df[list(columns_map.keys())].drop_duplicates().rename(columns=columns_map)
        return [model_class(**row).dict() for row in df_clean.to_dict(orient='records')]
    except Exception as e:
        logger.error(f"Failed to extract {model_class.__name__} data: {e}")
        return []

def get_all_cities(df): return extract_location(df, {
    'Tỉnh Thành Phố': 'name',
    'Tỉnh Thành Phố Tiếng Anh': 'full_name_en',
    'Tiếng Anh': 'name_en',
    'Tên Mã TP': 'code_name',
    'Mã Đơn Vị': 'unit_id',
    'Mã Vùng': 'region_id',
    'Cấp': 'unit_name',
    'Mã TP': 'code',
    'Miền': 'domestic_name',
    'Miền Tiếng Anh': 'domestic_name_en',
    'GHN Mã TP': 'ghn_code',
    'GHN Tỉnh Thành Phố': 'ghn_name'
}, City)

def get_all_districts(df): return extract_location(df, {
    'Quận Huyện': 'name',
    'Quận Huyện Tiếng Anh': 'full_name_en',
    'Tiếng Anh': 'name_en',
    'Tên Mã QH': 'code_name',
    'Mã Đơn Vị': 'unit_id',
    'Cấp': 'unit_name',
    'Mã QH': 'code',
    'Mã TP': 'city_code',
    'GHN Mã QH': 'ghn_code',
    'GHN Quận Huyện': 'ghn_name',
    'GHN Mã TP': 'ghn_province_code',
}, District)

def get_all_wards(df):
    df['Mã PX'] = pd.to_numeric(df['Mã PX'], errors='coerce')
    return extract_location(df, {
        'Phường Xã': 'name',
        'Phường Xã Tiếng Anh': 'full_name_en',
        'Tiếng Anh': 'name_en',
        'Tên Mã PX': 'code_name',
        'Mã Đơn Vị': 'unit_id',
        'Cấp': 'unit_name',
        'Mã PX': 'code',
        'Mã QH': 'district_code',
        'Mã TP': 'city_code',
        'GHN Mã PX': 'ghn_code',
        'GHN Phường Xã': 'ghn_name',
        'GHN Mã QH': 'ghn_district_code',
        'GHN Mã TP': 'ghn_province_code',
    }, Ward)

def get_all_regions(df): return extract_location(df, {
    'Mã Vùng': 'id',
    'Tên Vùng': 'name',
    'Tên Vùng Tiếng Anh': 'name_en',
    'Tên Mã Vùng': 'code_name',
    'Tên Mã Vùng Tiếng Anh': 'code_name_en',
    'Miền': 'domestic_name',
    'Miền Tiếng Anh': 'domestic_name_en'
}, Region)

def get_all_time(times: List[TimeReq]):
    try:
        return [{
            "route_id": t.route.id,
            "route_code": t.route.code,
            "vn_route": t.route.vn_route,
            "eng_route": t.route.eng_route,
            "range_time": t.range_time,
        } for t in times]
    except Exception as e:
        logger.error(f"Failed to process time records: {e}")
        return []

def get_all_fee(fees: List[FeeReq]):
    try:
        return [{
            "route_id": f.route.id,
            "route_code": f.route.code,
            "vn_route": f.route.vn_route,
            "eng_route": f.route.eng_route,
            "pricing": [{
                "weight_less_than_equal": p.weight_less_than_equal,
                "price": p.price,
            } for p in f.pricing],
            "threshold_weight": f.additional_pricing.threshold_weight,
            "additional_price_per_step": f.additional_pricing.additional_price_per_step,
            "step_weight": f.additional_pricing.step_weight,
        } for f in fees]
    except Exception as e:
        logger.error(f"Failed to process fee records: {e}")
        return []

def read_excel_file(filepath):
    return pd.read_excel(os.path.join('app/static', filepath))

def read_json_file(filepath):
    with open(os.path.join('app/static', filepath), 'r', encoding='utf-8') as f:
        return json.load(f)

def read_json_as_model_list(filepath, model):
    data = read_json_file(filepath)
    return [model(**item) for item in data]

index_mapping = {
    CITY_INDEX: get_all_cities,
    DISTRICT_INDEX: get_all_districts,
    WARD_INDEX: get_all_wards,
    REGION_INDEX: get_all_regions,
    TIME_INDEX: get_all_time,
    FEE_INDEX: get_all_fee,
}

file_reader_mapping = {
    CITY_INDEX: read_excel_file,
    DISTRICT_INDEX: read_excel_file,
    WARD_INDEX: read_excel_file,
    REGION_INDEX: read_excel_file,
    TIME_INDEX: lambda filepath: read_json_as_model_list(filepath, model_mapping_req.get(TIME_INDEX)),
    FEE_INDEX: lambda filepath: read_json_as_model_list(filepath, model_mapping_req.get(FEE_INDEX)),
}

model_mapping_req = {
    TIME_INDEX: TimeReq,
    FEE_INDEX: FeeReq,
}

model_mapping_res = {
    CITY_INDEX: City,
    DISTRICT_INDEX: District,
    WARD_INDEX: Ward,
    REGION_INDEX: Region,
    TIME_INDEX: TimeRes,
    FEE_INDEX: FeeRes,
}

async def insert_es_data(index: str, data_func: Callable, data_src):
    try:
        await create_index(index)
        records = data_func(data_src)
        if records:
            helpers.bulk(es_client, [{"_index": index, "_source": item} for item in records])
            logger.info(f"Inserted {len(records)} records into {index} successfully")
        else:
            logger.error(f"No data to insert into {index}")
    except helpers.BulkIndexError as e:
        logger.error(f"Bulk indexing error in {index}: {e}", exc_info=True)

async def create_index(index_name: str):
    try:
        if not es_client.indices.exists(index=index_name):
            es_client.indices.create(index=index_name)
            logger.info(f"Created index {index_name} successfully")
        else:
            logger.info(f"Index {index_name} already exists")
    except Exception as e:
        logger.error(f"Failed [create_indices] {index_name} : {e}")

async def index_has_data(index_name):
    try:
        es_response = es_client.count(index=index_name)
        return es_response["count"] > 0
    except Exception as e:
        logger.error(f"Lỗi khi kiểm tra index {index_name}: {e}")
        return False

def delete_index(index_name):
    try:
        if es_client.indices.exists(index=index_name):
            es_client.indices.delete(index=index_name)
            logger.info(f"Successfully deleted index: {index_name}")
        else:
            logger.info(f"Index {index_name} does not exist.")
    except Exception as e:
        logger.error("Failed to delete index:", error=e)

async def insert_es_common(index: str, file: str):
    if await index_has_data(index):
        logger.info(f"Index {index} đã có dữ liệu, bỏ qua insert!")
        return

    data_reader = file_reader_mapping.get(index)
    data_handler = index_mapping.get(index)

    if not data_reader or not data_handler:
        logger.error(f"Không hỗ trợ index {index} trong file_reader_mapping hoặc index_mapping")
        return

    try:
        raw_data = data_reader(file)
        await insert_es_data(index, data_handler, raw_data)
    except Exception as e:
        logger.error(f"Lỗi khi insert index {index}: {e}")

async def query_es_data(index_name, query):
    es_response = es_client.search(index=index_name, body=query)
    model = model_mapping_res.get(index_name)
    return [model(**hit["_source"]) for hit in es_response["hits"]["hits"]] if model else []

async def search_es(index: str, conditions: dict[str, Any]) -> Union[dict[str, Any], response.JsonException]:
    must_conditions = [{"match": {key: value}} for key, value in conditions.items()]

    query = {
        "query": {
            "bool": {
                "must": must_conditions
            }
        },
        "size": 1
    }

    try:
        es_response = es_client.search(index=index, body=query)
        if not es_response["hits"]["hits"]:
            return response.JsonException(
                status_code=HTTP_400_BAD_REQUEST,
                message=f"Không tìm thấy dữ liệu với điều kiện {conditions} trong {index}"
            )
        return es_response["hits"]["hits"][0]["_source"]
    except Exception as e:
        logger.error(f"Lỗi truy vấn Elasticsearch ({index}): {e}")
        raise e