import os

from dotenv import load_dotenv
from opensearchpy import OpenSearch, helpers

from app.core import logger

load_dotenv()

try:
    es_host = os.getenv("ES_HOST")
    es_port = os.getenv("ES_PORT")
    es_user = os.getenv("ES_USER")
    es_pw = os.getenv("ES_PW")

    es_client = OpenSearch(
        hosts=[es_host],
        http_auth=(es_user, es_pw),
        use_ssl=True,
        verify_certs=True
    )

    es_client.ping()
    print("Connected to Elasticsearch!")
except Exception as e:
    print("Error connecting to Elasticsearch", e)