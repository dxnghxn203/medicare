import os

import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from dotenv import load_dotenv
import time

from app.core import logger

load_dotenv()
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
AWS_S3_ENDPOINT = os.getenv("AWS_S3_ENDPOINT", "s3.amazonaws.com")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_BUCKET= os.getenv("AWS_BUCKET", "your-default-bucket")

ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xlsx', '.csv'}

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)

# Test the connection by listing the buckets
try:
    response = s3_client.list_buckets()
    logger.info("Connected to S3. Buckets available:")
    for bucket in response['Buckets']:
        logger.info(f" - {bucket['Name']}")
except NoCredentialsError:
    logger.error("Credentials not available.")
except ClientError as e:
    logger.error(f"Failed to connect to S3: {e}")

def create_bucket_if_not_exists(bucket_name):
    try:
        # Check if the bucket exists
        response = s3_client.list_buckets()
        existing_buckets = [bucket['Name'] for bucket in response['Buckets']]

        if bucket_name in existing_buckets:
            logger.info(f"Bucket '{bucket_name}' already exists.")
            return True

        # Create the bucket
        s3_client.create_bucket(Bucket=bucket_name)
        logger.info(f"Bucket '{bucket_name}' created successfully.")
        return True

    except ClientError as e:
        logger.error(f"Error occurred: {e}")
        return False
def upload_file(file, folder: str):
    try:
        #create_bucket_if_not_exists(AWS_BUCKET)
        # Construct the key with folder and file name
        name = str(time.time_ns())
        s3_key = f"{folder}/{name}"
        # Upload file to S3 bucket
        s3_client.upload_fileobj(file.file, AWS_BUCKET, s3_key, ExtraArgs={'ContentType': 'image/png', 'ACL': 'public-read'})
        # Generate the file URL
        file_url = f"https://{AWS_BUCKET}.{AWS_S3_ENDPOINT}/{s3_key}"
        logger.info(f"File uploaded successfully: {file_url}")
        return file_url
    except NoCredentialsError:
        logger.error("S3 Credentials not available.")
        return None
    except Exception as e:
        logger.error(f"S3 Failed to upload file: {str(e)}")
        return None

def upload_any_file(file, folder: str):
    try:
        #create_bucket_if_not_exists(AWS_BUCKET)
        name = str(int(time.time()))
        s3_key = f"{folder}/{name}"
        content_type = file.content_type or 'application/octet-stream'

        s3_client.upload_fileobj(
            file.file,
            AWS_BUCKET,
            s3_key,
            ExtraArgs={'ContentType': content_type}
        )

        file_url = f"https://{AWS_BUCKET}.{AWS_S3_ENDPOINT}/{s3_key}"
        logger.info(f"File uploaded successfully: {file_url}")
        return file_url
    except NoCredentialsError:
        logger.error("S3 Credentials not available.")
        return ""
    except Exception as e:
        logger.error(f"S3 Failed to upload file: {str(e)}")
        return None


