import pandas as pd
import json
import re

# Read file JSON
with open('full_json_generated_data_vn_units.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def normalize_name(name):
    replacements = {
        "NT ": "Nông Trường ",
        "N.T ": "Nông Trường "
    }

    for old, new in replacements.items():
        name = name.replace(old, new)

    corrections = {
        r"\bHoá\b": "Hóa",
        r"\bHoà\b": "Hòa",
        r"\bHoả\b": "Hỏa",
        r"\bHoã\b": "Hõa",
        r"\bHoạ\b": "Họa",
        r"\bThuý\b": "Thúy",
        r"\bThuỳ\b": "Thùy",
        r"\bThuỷ\b": "Thủy",
        r"\bThuỹ\b": "Thũy",
        r"\bThuỵ\b": "Thụy",
        r"\bQuí\b": "Quý",
        r"\bPhường ([1-9])\b": r"Phường 0\1",
    }
    
    for pattern, replacement in corrections.items():
        name = re.sub(pattern, replacement, name)

    return name.strip()

for province in data:
    province['Name'] = normalize_name(province['Name'])
    province['FullName'] = normalize_name(province['FullName'])
    for district in province['District']:
        district['Name'] = normalize_name(district['Name'])
        district['FullName'] = normalize_name(district['FullName'])
        for ward in district['Ward']:
            ward['Name'] = normalize_name(ward['Name'])
            ward['FullName'] = normalize_name(ward['FullName'])

with open('fixed_json_data_vn_units.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)