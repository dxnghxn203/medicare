import json
import pandas as pd
import re

# Load dữ liệu VN chuẩn (bạn đã có)
with open('fixed_json_data_vn_units.json', 'r', encoding='utf-8') as f:
    vn_data = json.load(f)

# Load dữ liệu GHN (giao hàng nhanh)
with open('ghn_location.json', 'r', encoding='utf-8') as f:
    ghn_data = json.load(f)

import re
import json

def parse_corrupted_ward_entry(entry: dict) -> dict:
    ward_code = entry.get("WardCode")
    raw_ward_name = entry.get("WardName", "")

    # Lấy phần tên thực sự trước dấu `,`
    name_match = re.match(r'([^,]+)', raw_ward_name)
    clean_name = name_match.group(1).strip() if name_match else raw_ward_name.strip()

    # Tìm NameExtension nếu có
    ext_match = re.search(r'NameExtension:\[([^\]]+)\]', raw_ward_name)
    if ext_match:
        extensions = [e.strip() for e in ext_match.group(1).split(',')]
    else:
        extensions = []

    return {
        "WardCode": ward_code,
        "WardName": clean_name,
        "NameExtension": extensions
    }


def replace_iterator(text):
    if not text:
        return ''

    # Thay các âm bắt đầu bằng "qu" + y thành "qu" + i tương ứng
    replacements = {
        r'\bquy\b': 'qui',
        r'\bquý\b': 'quí',
        r'\bquỳ\b': 'quì',
        r'\bquỵ\b': 'quị',
        r'\bquỹ\b': 'quĩ',
        "nông trường": "nt",
        "phường 01": "phuong 1",
        "phường 02": "phuong 2",
        "phường 03": "phuong 3",
        "phường 04": "phuong 4",
        "phường 05": "phuong 5",
        "phường 06": "phuong 6",
        "phường 07": "phuong 7",
        "phường 08": "phuong 8",
        "phường 09": "phuong 9",
    }

    for pattern, replacement in replacements.items():
        text = re.sub(pattern, replacement, text)

    return text
# Tạo các lookup dict cho GHN dựa trên tên thường dùng và name extensions (bỏ dấu, viết thường)
def normalize_name(name):
    if not name:
        return ''
    import unicodedata
    name = name.lower().strip()
    name = replace_iterator(name)
    name = ''.join(
        c for c in unicodedata.normalize('NFD', name)
        if unicodedata.category(c) != 'Mn'
    )
    name = name.replace('.', '').replace(',', '').replace('-', ' ').replace('_', ' ')
    name = ' '.join(name.split())  # remove extra spaces
    return name

def build_ghn_province_lookup(ghn_data):
    lookup = {}
    for p in ghn_data:
        # tất cả các tên mở rộng
        names = [p['province_name']] + p.get('province_name_extension', [])
        for n in names:
            lookup[normalize_name(n)] = p
    return lookup

def build_ghn_district_lookup(ghn_data):
    lookup = {}
    for p in ghn_data:
        province_names = [p['province_name']] + p.get('province_name_extension', [])
        province_keys = [normalize_name(n) for n in province_names]

        for d in p['districts']:
            ext = d.get('district_name_extension', [])
            if not isinstance(ext, list):
                ext = [ext]
            district_names = [d['district_name']] + ext
            district_keys = [normalize_name(name) for name in district_names]

            for prov_key in province_keys:
                for dist_key in district_keys:
                    lookup[(prov_key, dist_key)] = d
    return lookup


def build_ghn_ward_lookup(ghn_data):
    lookup = {}
    for p in ghn_data:
        province_names = [p['province_name']] + p.get('province_name_extension', [])
        province_keys = [normalize_name(n) for n in province_names]

        for d in p.get('districts', []):
            ext = d.get('district_name_extension', [])
            if not isinstance(ext, list):
                ext = [ext]
            district_names = [d['district_name']] + ext
            district_keys = [normalize_name(n) for n in district_names]

            if not d.get('wards'):
                continue

            for w in d['wards']:
                if 'NameExtension' not in w and 'NameExtension:[' in w.get('WardName', ''):
                    w = parse_corrupted_ward_entry(w)

                ward_names = [w['WardName']] + w.get('NameExtension', [])
                ward_names = [w['WardName']] + w.get('NameExtension', [])
                ward_keys = [normalize_name(n) for n in ward_names]

                for prov_key in province_keys:
                    for dist_key in district_keys:
                        for ward_key in ward_keys:
                            lookup[(prov_key, dist_key, ward_key)] = w
    return lookup


ghn_province_lookup = build_ghn_province_lookup(ghn_data)
ghn_district_lookup = build_ghn_district_lookup(ghn_data)
ghn_ward_lookup = build_ghn_ward_lookup(ghn_data)

DISTRICT_NAME_OVERRIDES = {
    "huyen ia h' drai": "huyen ia h drai",
    "huyen ea h'leo": "huyen ea h leo",
    "huyen buon đon": "huyen buon ðon",
    "huyen cu m'gar": "huyen cu m gar",
    "huyen m'đrak": "huyen m đrak",
    "huyen krong a na": "huyen krong ana",
    "huyen đak r'lap": "huyen đak r lap",
}
def apply_district_name_override(name):
    return DISTRICT_NAME_OVERRIDES.get(name, name)
WARD_NAME_OVERRIDES = {
}

def apply_ward_name_override(name):
    n = normalize_name(name)
    return WARD_NAME_OVERRIDES.get(n, n)

WARD_OVERRIDE_MAP = {
    "tr'hy": {
        'WardCode': '341610',
        'WardName': "Xã Tr'hy"
    },
    "xa lang": {
        'WardCode': '341609',
        'WardName': "Xã Lăng"
    },
    "xa ch'om": {
        'WardCode': '341606',
        'WardName': "Xã Chơm"
    },
    "xa ga ri": {
        'WardCode': '341608',
        'WardName': "Xã Ga Ri"
    },
    "xa a xan": {
        'WardCode': '341604',
        'WardName': "Xã A Xan"
    },
    "xa a nong": {
        'WardCode': '3416031',
        'WardName': "Xã A Nông"
    },
    "xa a tieng": {
        'WardCode': '341602',
        'WardName': "Xã A Tiêng"
    },
    "xa bha le": {
        'WardCode': '341605',
        'WardName': "Xã Bha Lê"
    },
    "xa a vuong": {
        'WardCode': '341603',
        'WardName': "Xã A Vương"
    },
    "xa dang": {
        'WardCode': '341607',
        'WardName': "Xã Dang"
    },
}

def apply_ward_override_map(normalized_name):
    return WARD_OVERRIDE_MAP.get(normalized_name)


# Hàm generate variants tên cho VN data (nếu muốn có thể mở rộng)
def generate_name_variants(name):
    # Đơn giản: chỉ dùng 1 biến thể chuẩn normalize
    return [normalize_name(name)]

# Mảng lưu kết quả không match để kiểm tra
unmatched_provinces = []
unmatched_districts = []
unmatched_wards = []

# Bắt đầu map
last_matched_ward = None
for province in vn_data:
    prov_name_variants = generate_name_variants(province['Name'])
    matched_province = None
    for prov_name in prov_name_variants:
        if prov_name in ghn_province_lookup:
            matched_province = ghn_province_lookup[prov_name]
            province["GHNProvinceCode"] = str(matched_province['province_id'])
            province["GHNProvinceName"] = matched_province['province_name']
            break
    if not matched_province:
        unmatched_provinces.append(province['Name'])
        province["GHNProvinceCode"] = None
        province["GHNProvinceName"] = None

    for district in province.get('District', []):
        matched_district = None
        dist_name_variants = generate_name_variants(district['Name'])
        full_dist_name_variants = generate_name_variants(district['FullName'])
        all_variants = dist_name_variants + full_dist_name_variants
        for dist_name in all_variants:
            normalized_name = apply_district_name_override(dist_name)
            key = (prov_name if matched_province else '', normalized_name)
            if key in ghn_district_lookup:
                matched_district = ghn_district_lookup[key]
                district["GHNDistrictCode"] = str(matched_district['district_id'])
                district["GHNDistrictName"] = matched_district['district_name']
                break

        if not matched_district:
            unmatched_districts.append({
                'province': province['Name'],
                'district': district['Name'],
                'district_full_name': district['FullName'],
                'district_data': all_variants,
                'province_full_name': province['FullName'],
                'province_data': prov_name_variants
            })
            district["GHNDistrictCode"] = None
            district["GHNDistrictName"] = None

        
        for ward in district.get('Ward', []):
            matched_ward = None

            ward_name_variants = generate_name_variants(ward['Name'])
            full_ward_name_variants = generate_name_variants(ward['FullName'])
            all_ward_variants = ward_name_variants + full_ward_name_variants
            for ward_name in all_ward_variants:
                normalized_name = apply_ward_name_override(ward_name)
                key = (
                    prov_name if matched_province else '',
                    dist_name if matched_district else '',
                    normalized_name
                )
                if key in ghn_ward_lookup:
                    matched_ward = ghn_ward_lookup[key]
                    last_matched_ward = ghn_ward_lookup[key]
                    ward["GHNWardCode"] = matched_ward['WardCode']
                    ward["GHNWardName"] = matched_ward['WardName']
                    break
                override = apply_ward_override_map(normalized_name)
                if override:
                    matched_ward = override
                    last_matched_ward = override
                    ward["GHNWardCode"] = override['WardCode']
                    ward["GHNWardName"] = override['WardName']
                    break

            if not matched_ward and last_matched_ward:
                ward["GHNWardCode"] = last_matched_ward['WardCode']
                ward["GHNWardName"] = last_matched_ward['WardName']
                unmatched_wards.append({
                    'province': province['Name'],
                    'district': district['Name'],
                    'ward': ward['Name'],
                    'ward_full_name': ward.get('FullName'),
                    'ward_variants': all_ward_variants,
                })


# Xuất file mapping ra JSON
with open('ghn_mapping.json', 'w', encoding='utf-8') as f:
    json.dump(vn_data, f, ensure_ascii=False, indent=2)

print(f"Unmatched provinces: {len(unmatched_provinces)}")
print(f"Unmatched districts: {len(unmatched_districts)}")
print(f"Unmatched wards: {len(unmatched_wards)}")

# Lưu ra excel để dễ theo dõi nếu muốn
if unmatched_provinces:
    pd.DataFrame({'ProvinceName': unmatched_provinces}).to_excel('ghn_unmatched_provinces.xlsx', index=False)
if unmatched_districts:
    pd.DataFrame(unmatched_districts).to_excel('ghn_unmatched_districts.xlsx', index=False)
if unmatched_wards:
    pd.DataFrame(unmatched_wards).to_excel('ghn_unmatched_wards.xlsx', index=False)

print("Mapping hoàn tất và xuất file ghn_mapping.json")

# with open('ghn_ward_lookup_debug.json', 'w', encoding='utf-8') as f:
#     json.dump({str(k): v for k, v in ghn_ward_lookup.items()}, f, ensure_ascii=False, indent=2)
