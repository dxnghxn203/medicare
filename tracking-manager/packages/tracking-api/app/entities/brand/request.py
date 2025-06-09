from pydantic import BaseModel


class ItemBrand(BaseModel):
    brand_id: str
    name: str = None
    description: str = None
    logo: str = None
    category: str = None
    active: bool = True

class ItemBrandRequestCreate(BaseModel):
    name: str
    description: str = None
    category: str = None
    active: bool = True

class ItemBrandRequestUpdate(BaseModel):
    brand_id: str
    name: str = None
    description: str = None
    category: str = None
    active: bool = True




