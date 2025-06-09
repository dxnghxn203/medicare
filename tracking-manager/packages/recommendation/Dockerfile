FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-vie \
    poppler-utils \
    libgl1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt /requirements.txt

RUN pip install --no-cache-dir -r /requirements.txt

ENV ROOT /app/

COPY ./ $ROOT

WORKDIR $ROOT

EXPOSE 80
