import json
import os
from typing import Optional, Dict, List

from app.middleware.logging import logger


def load_banks() -> Dict:
    """Load all banks from JSON file"""
    current_dir = os.path.dirname(os.path.dirname(__file__))
    json_path = os.path.join(current_dir, 'static', 'bank.json')
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # Fix: Use bank's code as key instead of the bank dict itself
            return {bank['code']: bank for bank in data['data']}
    except Exception as e:
        logger.error(f"Error loading banks: {str(e)}")
        return {}

def get_supported_banks() -> List[Dict]:
    """Get list of supported banks"""
    banks = load_banks()
    return [bank for bank in banks.values() if bank.get('supported')]

def get_bank_by_code(code: str) -> Optional[Dict]:
    """Get bank details by bank code"""
    banks = load_banks()
    bank = banks.get(code)
    if not bank or not bank.get('supported'):
        return None
    return bank

def get_account_number(code: str) -> Optional[str]:
    """Get account number for specific bank"""
    bank = get_bank_by_code(code)
    return bank.get('account_number') if bank else None

def validate_bank_code(code: str) -> bool:
    """Validate if bank code exists and is supported"""
    bank = get_bank_by_code(code)
    return bank is not None and bank.get('supported', False)

