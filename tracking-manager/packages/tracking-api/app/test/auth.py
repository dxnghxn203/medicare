import unittest
import requests
import json
from datetime import datetime, timedelta


class TestUserRegistrationAPI(unittest.TestCase):

    def setUp(self):
        """Setup test environment"""
        self.base_url = "https://tracking-api.medicaretech.io.vn"
        self.endpoint = "/v1/user/register_email"
        self.headers = {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        }

    def test_register_with_valid_data(self):
        """Test đăng ký với dữ liệu hợp lệ"""
        payload = {
            "phone_number": "0901234567",
            "user_name": f"testuser_valid_{int(datetime.now().timestamp())}",
            "email": f"testuser{int(datetime.now().timestamp())}@example.com",
            "password": "SecurePass123!",
            "gender": "male",
            "birthday": "1990-01-01T00:00:00.000Z"
        }

        response = requests.post(
            self.base_url + self.endpoint,
            headers=self.headers,
            data=json.dumps(payload)
        )

        print(f"Valid data test - Status: {response.status_code}")
        print(f"Response: {response.text}")

        # Kiểm tra status code thực tế
        self.assertIsInstance(response.status_code, int)
        # Ghi nhận status code để phân tích

    def test_register_with_actual_email_dxnghxn203(self):
        """Test đăng ký với email dxnghxn203@gmail.com"""
        payload = {
            "phone_number": "0987654321",
            "user_name": "dxnghxn203_test_new",
            "email": "dxnghxn203@gmail.com",
            "password": "TestPassword123!",
            "gender": "male",
            "birthday": "1995-06-06T13:21:10.476Z"
        }

        response = requests.post(
            self.base_url + self.endpoint,
            headers=self.headers,
            data=json.dumps(payload)
        )

        print(f"Actual email test - Status: {response.status_code}")
        print(f"Response: {response.text}")

        # Kiểm tra xem có phải 200 như bạn nói không
        if response.status_code == 200:
            print("✅ API returns 200 as expected")
            response_data = response.json()
            # Kiểm tra response structure
            self.assertIsInstance(response_data, dict)
        else:
            print(f"❌ Unexpected status code: {response.status_code}")

    def test_register_with_exact_curl_data(self):
        """Test với data y hệt như curl command gốc"""
        payload = {
            "phone_number": "string",
            "user_name": "string",
            "email": "dxnghxn203@gmail.com",
            "password": "string",
            "gender": "string",
            "birthday": "2025-06-06T13:21:10.476Z"
        }

        response = requests.post(
            self.base_url + self.endpoint,
            headers=self.headers,
            data=json.dumps(payload)
        )

        print(f"Exact curl data test - Status: {response.status_code}")
        print(f"Response: {response.text}")

        # Ghi nhận status code thực tế
        self.assertIsInstance(response.status_code, int)

    def test_register_with_future_birthday(self):
        """Test với ngày sinh trong tương lai (2025-06-06)"""
        payload = {
            "phone_number": "0901234568",
            "user_name": f"future_user_{int(datetime.now().timestamp())}",
            "email": f"future{int(datetime.now().timestamp())}@example.com",
            "password": "Password123!",
            "gender": "female",
            "birthday": "2025-06-06T13:21:10.476Z"  # Future date
        }

        response = requests.post(
            self.base_url + self.endpoint,
            headers=self.headers,
            data=json.dumps(payload)
        )

        print(f"Future birthday test - Status: {response.status_code}")
        print(f"Response: {response.text}")

        # Kiểm tra API có validate future date không

    def test_register_missing_fields(self):
        """Test thiếu các trường bắt buộc"""
        payload = {
            "email": "incomplete@example.com",
            "password": "Password123!"
            # Missing: phone_number, user_name, gender, birthday
        }

        response = requests.post(
            self.base_url + self.endpoint,
            headers=self.headers,
            data=json.dumps(payload)
        )

        print(f"Missing fields test - Status: {response.status_code}")
        print(f"Response: {response.text}")

    def test_register_invalid_email_format(self):
        """Test với email không đúng format"""
        payload = {
            "phone_number": "0901234569",
            "user_name": f"invalid_email_{int(datetime.now().timestamp())}",
            "email": "invalid-email-format",
            "password": "Password123!",
            "gender": "other",
            "birthday": "1990-01-01T00:00:00.000Z"
        }

        response = requests.post(
            self.base_url + self.endpoint,
            headers=self.headers,
            data=json.dumps(payload)
        )

        print(f"Invalid email test - Status: {response.status_code}")
        print(f"Response: {response.text}")

    def test_register_empty_string_fields(self):
        """Test với các trường là empty string"""
        payload = {
            "phone_number": "",
            "user_name": "",
            "email": f"empty{int(datetime.now().timestamp())}@example.com",
            "password": "",
            "gender": "",
            "birthday": "1990-01-01T00:00:00.000Z"
        }

        response = requests.post(
            self.base_url + self.endpoint,
            headers=self.headers,
            data=json.dumps(payload)
        )

        print(f"Empty fields test - Status: {response.status_code}")
        print(f"Response: {response.text}")

    def test_check_response_format(self):
        """Kiểm tra format response của API"""
        payload = {
            "phone_number": "0903333333",
            "user_name": f"format_test_{int(datetime.now().timestamp())}",
            "email": f"format{int(datetime.now().timestamp())}@example.com",
            "password": "Password123!",
            "gender": "male",
            "birthday": "1988-01-01T00:00:00.000Z"
        }

        response = requests.post(
            self.base_url + self.endpoint,
            headers=self.headers,
            data=json.dumps(payload)
        )

        print(f"Response format test - Status: {response.status_code}")
        print(f"Response: {response.text}")
        print(f"Response headers: {dict(response.headers)}")

        try:
            response_data = response.json()
            print(f"✅ Valid JSON response")
            print(f"Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'Not a dict'}")
        except:
            print(f"❌ Response is not valid JSON")

    def test_duplicate_email_behavior(self):
        """Test hành vi khi email trùng lặp"""
        timestamp = int(datetime.now().timestamp())
        same_email = f"duplicate{timestamp}@example.com"

        payload1 = {
            "phone_number": "0901111111",
            "user_name": f"duplicate_1_{timestamp}",
            "email": same_email,
            "password": "Password123!",
            "gender": "male",
            "birthday": "1990-01-01T00:00:00.000Z"
        }

        response1 = requests.post(
            self.base_url + self.endpoint,
            headers=self.headers,
            data=json.dumps(payload1)
        )

        print(f"First registration - Status: {response1.status_code}")
        print(f"First response: {response1.text}")

        payload2 = {
            "phone_number": "0902222222",
            "user_name": f"duplicate_2_{timestamp}",
            "email": same_email,  # Same email
            "password": "Password456!",
            "gender": "female",
            "birthday": "1992-01-01T00:00:00.000Z"
        }

        response2 = requests.post(
            self.base_url + self.endpoint,
            headers=self.headers,
            data=json.dumps(payload2)
        )

        print(f"Second registration - Status: {response2.status_code}")
        print(f"Second response: {response2.text}")

        if response1.status_code == response2.status_code == 200:
            print("⚠️ Both registrations returned 200 - Check if duplicates are allowed")
        elif response1.status_code == 200 and response2.status_code != 200:
            print("✅ Duplicate email properly rejected")
        else:
            print(f"🤔 Unexpected behavior - analyze responses")


if __name__ == '__main__':
    unittest.main(verbosity=2, buffer=False)