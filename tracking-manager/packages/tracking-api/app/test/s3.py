import os
import unittest

from app.core.s3 import s3_client
class MyTestCase(unittest.IsolatedAsyncioTestCase):
    async def test(self):
        BUCKET_NAME = "medicaretechs3"
        LOCAL_FOLDER = "./s3_download"
        os.makedirs(LOCAL_FOLDER, exist_ok=True)

        paginator = s3_client.get_paginator("list_objects_v2")
        for page in paginator.paginate(Bucket=BUCKET_NAME):
            if "Contents" in page:
                for obj in page["Contents"]:
                    key = obj["Key"]
                    local_path = os.path.join(LOCAL_FOLDER, key)

                    # Tạo thư mục con nếu có
                    os.makedirs(os.path.dirname(local_path), exist_ok=True)

                    print(f"Downloading: {key} -> {local_path}")
                    s3_client.download_file(BUCKET_NAME, key, local_path)
        self.assertTrue(True)

if __name__ == '__main__':
    unittest.main(verbosity=2)
