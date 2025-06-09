import pandas as pd
import json

with open('fixed_json_data_vn_units.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def create_cities_df(data):

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
            'Miền Tiếng Anh': 'North' if province['AdministrativeRegionId'] in [1, 2, 3] else 'Central' if province['AdministrativeRegionId'] in [4, 5, 6] else 'South'
        })
    return pd.DataFrame(cities)


def create_districts_df(data):
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
            })
    return pd.DataFrame(districts)

def create_wards_df(data):
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
                }
                wards.append(ward_data)

    return pd.DataFrame(wards)

def create_regions_df():
    with open('administrative_regions.json', 'r', encoding='utf-8') as f:
        df = json.load(f)
    regions = []
    for region in df:
        regions.append({
            'Mã Vùng': region['Id'],
            'Tên Vùng': region['Name'],
            'Tên Vùng Tiếng Anh': region['NameEn'],
            'Tên Mã Vùng': region['CodeName'],
            'Tên Mã Vùng Tiếng Anh': region['CodeNameEn'],
            'Miền': 'Bắc' if region['Id'] in [1, 2, 3] else 'Trung' if region['Id'] in [4, 5, 6] else 'Nam',
            'Miền Tiếng Anh': 'North' if region['Id'] in [1, 2, 3] else 'Central' if region['Id'] in [4, 5, 6] else 'South'
        })
    return pd.DataFrame(regions)

cities_df = create_cities_df(data)
districts_df = create_districts_df(data)
wards_df = create_wards_df(data)
regions_df = create_regions_df()

cities_df.to_excel('cities.xlsx', index=False)
districts_df.to_excel('districts.xlsx', index=False)
wards_df.to_excel('wards.xlsx', index=False)
regions_df.to_excel('regions.xlsx', index=False)

print("Data exported succesfully")