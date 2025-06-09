import random
import string
from datetime import datetime

def generate_random_string(length: int) -> str:
    charset = string.ascii_uppercase + string.digits
    return ''.join(random.choices(charset, k=length))

def generate_id(prefix: str) -> str:
    random_id = generate_random_string(3)
    timestamp = int(datetime.utcnow().timestamp())
    return f"{prefix}{random_id}{timestamp}"
