import pandas as pd
import json

with open('ghn_mapping.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def create_ghn_cities_df(data):

    cities = []
    for province in data:
        cities.append({
            'Tỉnh Thành Phố': province['FullName'],
            'Tỉnh Thành Phố Tiếng Anh': province['FullNameEn'],
            'Tiếng Anh': province['NameEn'],
            'Tên Mã TP': province['CodeName'],
            'Mã Đơn Vị': province['AdministrativeUnitId'],
            'Mã Vùng': province['AdministrativeRegionId'],
            'Cấp': province['AdministrativeUnitShortName'],
            'Mã TP': province['Code'],
            'Miền': 'Bắc' if province['AdministrativeRegionId'] in [1, 2, 3] else 'Trung' if province['AdministrativeRegionId'] in [4, 5, 6] else 'Nam',
            'Miền Tiếng Anh': 'North' if province['AdministrativeRegionId'] in [1, 2, 3] else 'Central' if province['AdministrativeRegionId'] in [4, 5, 6] else 'South',
            'GHN Mã TP': province['GHNProvinceCode'],
            'GHN Tỉnh Thành Phố': province['GHNProvinceName'],
        })
    return pd.DataFrame(cities)


def create_ghn_districts_df(data):
    districts = []
    for province in data:
        for district in province['District']:
            districts.append({
                'Quận Huyện': district['FullName'],
                'Quận Huyện Tiếng Anh': district['FullNameEn'],
                'Tiếng Anh': district['NameEn'],
                'Tên Mã QH': district['CodeName'],
                'Mã Đơn Vị': district['AdministrativeUnitId'],
                'Cấp': district['AdministrativeUnitShortName'],
                'Mã QH': district['Code'],
                'Mã TP': district['ProvinceCode'],
                'GHN Mã QH': district['GHNDistrictCode'],
                'GHN Quận Huyện': district['GHNDistrictName'],
                'GHN Mã TP': province['GHNProvinceCode'],
            })
    return pd.DataFrame(districts)

def create_ghn_wards_df(data):
    wards = []
    for province in data:
        for district in province['District']:
            for ward in district['Ward']:
                ward_data = {
                    'Phường Xã': ward['FullName'],
                    'Phường Xã Tiếng Anh': ward['FullNameEn'],
                    'Tiếng Anh': ward['NameEn'],
                    'Tên Mã PX': ward['CodeName'],
                    'Mã Đơn Vị': ward['AdministrativeUnitId'],
                    'Cấp': ward['AdministrativeUnitShortName'],
                    'Mã PX': ward['Code'],
                    'Mã QH': ward['DistrictCode'],
                    'Mã TP': district['ProvinceCode'],
                    'GHN Mã PX': ward['GHNWardCode'],
                    'GHN Phường Xã': ward['GHNWardName'],
                    'GHN Mã QH': district['GHNDistrictCode'],
                    'GHN Mã TP': province['GHNProvinceCode'],
                }
                wards.append(ward_data)

    return pd.DataFrame(wards)

cities_df = create_ghn_cities_df(data)
districts_df = create_ghn_districts_df(data)
wards_df = create_ghn_wards_df(data)
cities_df.to_excel('ghn_cities.xlsx', index=False)
districts_df.to_excel('ghn_districts.xlsx', index=False)
wards_df.to_excel('ghn_wards.xlsx', index=False)

print("Data exported succesfully")