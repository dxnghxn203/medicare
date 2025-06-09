FROM golang:1.22 AS builder

RUN apt-get update && apt-get install -y bash make gcc

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main .

# Final image with wkhtmltopdf
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y \
        wkhtmltopdf \
        ca-certificates \
        tzdata \
        bash && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/main /app/main
COPY --from=builder /app/.env /app/.env

EXPOSE 10000

CMD ["/app/main"]
