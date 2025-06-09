from pydantic import BaseModel

class City(BaseModel):
    name: str
    code: int
    full_name_en: str
    name_en: str
    code_name: str
    unit_id: int
    region_id: int
    unit_name: str
    domestic_name: str
    domestic_name_en: str
    ghn_code: int
    ghn_name: str

class District(BaseModel):
    name: str
    code: int
    full_name_en: str
    name_en: str
    code_name: str
    unit_id: int
    unit_name: str
    city_code: int
    ghn_code: int
    ghn_name: str
    ghn_province_code: int

class Ward(BaseModel):
    name: str
    code: int
    full_name_en: str
    name_en: str
    code_name: str
    unit_id: int
    unit_name: str
    district_code: int
    city_code: int
    ghn_code: str
    ghn_name: str
    ghn_district_code: int
    ghn_province_code: int

class Region(BaseModel):
    id: int
    name: str
    name_en: str
    code_name: str
    code_name_en: str
    domestic_name: str
    domestic_name_en: str

class ItemLocationrRes(BaseModel):
    user_id: str
    address: str
    ward: str
    district:  str
    province: str
    sender_province_code: int
    sender_district_code: int
    sender_commune_code: int
    receiver_province_code: int
    receiver_district_code: int
    receiver_commune_code: int

class ItemLocationUser(BaseModel):
    location_id: str
    name: str
    phone_number: str
    address: str
    ward: str
    district:  str
    province: str
    province_code: int
    district_code: int
    ward_code: int

class LocationUserRes(BaseModel):
    user_id: str
    default_location: str
    locations: list[ItemLocationrRes] = []
