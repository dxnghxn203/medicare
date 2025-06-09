# Dockerfile
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

COPY ./requirements.txt /requirements.txt

RUN pip install --no-cache-dir -r /requirements.txt

ENV ROOT /packages/payment/

COPY ./ $ROOT

WORKDIR $ROOT

EXPOSE 80
