FROM python:3.11-slim AS builder

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip wheel --no-cache-dir --wheel-dir /wheels -r /tmp/requirements.txt

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11 AS production

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        wkhtmltopdf \
        xfonts-75dpi \
        xfonts-base \
        curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN groupadd -r appuser --gid 1000 && \
    useradd -r -g appuser --uid 1000 --home-dir /app --shell /bin/bash appuser

COPY ./requirements.txt /tmp/requirements.txt
COPY --from=builder /wheels /wheels

RUN pip install --no-cache-dir --upgrade pip && \
    (pip install --no-cache-dir --no-index --find-links /wheels /wheels/* || \
     pip install --no-cache-dir -r /tmp/requirements.txt) && \
    rm -rf /wheels /tmp/requirements.txt /root/.cache

ENV ROOT=/app
WORKDIR $ROOT

COPY --chown=appuser:appuser ./ $ROOT

ENV MAX_BODY_SIZE=500
ENV PYTHONPATH=$ROOT
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:80/health || curl -f http://localhost:80/docs || exit 1

USER appuser

EXPOSE 80