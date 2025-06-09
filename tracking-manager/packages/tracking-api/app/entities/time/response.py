from pydantic import BaseModel

class TimeRes(BaseModel):
    route_id: str
    route_code: str
    vn_route: str
    eng_route: str
    range_time: float