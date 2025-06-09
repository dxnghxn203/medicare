from datetime import datetime, timezone, timedelta
import os

def get_utc_now():
    return datetime.now(timezone.utc)

def format_timestamp(dt: datetime) -> str:
    return dt.isoformat()

def get_current_time():
    try:
        offset_hours = int(os.getenv("TIMEZONE_OFFSET_HOURS", "0"))
    except ValueError:
        print("Invalid value for TIMEZONE_OFFSET_HOURS environment variable")
        offset_hours = 0
    return datetime.now() + timedelta(hours=offset_hours)