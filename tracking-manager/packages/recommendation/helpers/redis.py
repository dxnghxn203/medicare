import json
import uuid
from typing import Set
from core import redis as redis_client, logger

redis = redis_client.redis_client
REQUEST_COUNT_MAX=5
MAX_ITEM_REVIEW=5
SESSION_TTL=1800 # 30 minutes
TOKEN_TTL=86400
BLOCK_TTL=1800
OTP_TTL=300
# ==== OTP & REQUEST COUNT MANAGEMENT ====

def otp_key(username: str) -> str:
    return f"otp_request:{username}"

def request_count_key(username: str) -> str:
    return f"otp_request_count:{username}"

def block_key(username: str) -> str:
    return f"block_otp:{username}"

def get_ttl(key: str):
    return redis.ttl(key)

def check_request_count(username):
    if redis.exists(block_key(username)):
        return False

    key=request_count_key(username)
    count = redis.get(key)

    if count is None:
        return True
    count = int(count.decode() if isinstance(count, bytes) else count)

    if count < REQUEST_COUNT_MAX:
        return True

    delete_otp(username)
    redis.incr(key)
    redis.expire(key, 1800)
    block_otp(username)
    return False

def update_otp_request_count_value(username: str):
    key = request_count_key(username)
    redis.incr(key)
    redis.expire(key, max(get_ttl(key), OTP_TTL))

def save_otp(username: str, otp: str):
    redis.set(otp_key(username), otp, OTP_TTL)

def block_otp(username: str):
    redis.set(block_key(username), 1, BLOCK_TTL)

def save_otp_and_update_request_count(username: str, otp: str):
    save_otp(username, otp)
    update_otp_request_count_value(username)

def get_otp(username: str):
    value = redis.get(otp_key(username))
    return value.decode() if isinstance(value, bytes) else value

def delete_otp(username: str):
    redis.delete(otp_key(username))

# ==== JWT TOKEN MANAGEMENT ====

def jwt_token_key(username: str, device_id: str) -> str:
    return f"{device_id}_jwt_token:{username}"

def get_jwt_token(username: str, device_id: str = "web"):
    token = redis.get(jwt_token_key(username, device_id))
    return token.decode() if isinstance(token, bytes) else token

def save_jwt_token(username: str, token: str, device_id: str = "web"):
    redis.set(jwt_token_key(username, device_id), token)

def delete_jwt_token(username: str, device_id: str = "web"):
    redis.delete(jwt_token_key(username, device_id))

# ==== PRODUCT MANAGEMENT ====

def product_key(product_id: str) -> str:
    return f"product:{product_id}"

def get_product_transaction(product_id: str):
    key = product_key(product_id)
    data = redis.hgetall(key)

    return {field: int(data[field]) for field in ["inventory", "sell"] if field in data} if data else None


def delete_product(product_id: str):
    redis.delete(product_key(product_id))

async def get_all_redis_product_ids() -> Set[str]:
    keys = redis.keys("product:*")
    product_ids = set()
    for key in keys:
        if isinstance(key, bytes):
            key = key.decode()
        product_ids.add(key.split(":")[1])
    return product_ids

# ==== ORDER MANAGEMENT ====

def order_key(order_id: str) -> str:
    return f"order:{order_id}"


def get_order(order_id: str):
    data = redis.get(order_key(order_id))
    return data.decode() if isinstance(data, bytes) else data

# ==== SESSION MANAGEMENT ====

def session_key(session_id: str) -> str:
    return f"session:{session_id}"

def save_session():
    session_id = str(uuid.uuid4())
    redis.set(session_key(session_id),session_id, SESSION_TTL)
    return session_id

def get_session(session_id: str):
    key = session_key(session_id)
    logger.info(f"key: {key}")
    return redis.get(key)

def delete_session(session_id: str):
    redis.delete(session_key(session_id))

# ==== VIEW MANAGEMENT ====

def recently_viewed_key(identifier: str) -> str:
    return f"recently_viewed:{identifier}"

def get_recently_viewed(identifier: str):
    product_ids = redis.lrange(recently_viewed_key(identifier), 0, -1)
    return product_ids

def save_recently_viewed(identifier: str, product_id: str, is_authenticated: bool):
    key = recently_viewed_key(identifier)
    redis.lrem(key, 0, product_id)
    redis.lpush(key, product_id)
    redis.ltrim(key, 0, MAX_ITEM_REVIEW - 1)
    TTL =  TOKEN_TTL if is_authenticated else SESSION_TTL
    redis.expire(key, TTL)

def delete_recently_viewed(identifier: str):
    redis.delete(recently_viewed_key(identifier))

# ==== CART MANAGEMENT ====
def cart_key(identifier: str) -> str:
    return f"cart:{identifier}"

def get_cart(identifier: str):
    data = redis.hgetall(cart_key(identifier))
    return data

def remove_cart_item(identifier: str, redis_id: str):
    redis.hdel(cart_key(identifier), redis_id)

def save_cart(identifier: str, redis_id, quantity: int):
    key = cart_key(identifier)
    cart_data = redis.hget(key, redis_id)

    if cart_data:
        cart_data = int(cart_data)
        cart_data += quantity
    else:
        cart_data = quantity

    redis.hset(key, redis_id, cart_data)
    redis.expire(key, SESSION_TTL)


def delete_cart(identifier: str):
    redis.delete(cart_key(identifier))
