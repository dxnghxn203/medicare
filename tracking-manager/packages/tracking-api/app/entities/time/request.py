from pydantic import BaseModel

class RouteReq(BaseModel):
    id: str
    code: str
    vn_route: str
    eng_route: str

class TimeReq(BaseModel):
    route: RouteReq
    range_time: float

class TimeGHNReq(BaseModel):
    from_district_id: int
    from_ward_code: str
    to_district_id: int
    to_ward_code: str
    service_id: int

