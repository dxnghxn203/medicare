FROM golang:1.23-alpine AS builder

RUN echo "Installing system dependencies..." && \
    apk update && \
    apk add --no-cache bash make gcc musl-dev

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

FROM alpine:latest

RUN apk add --no-cache bash ca-certificates tzdata

WORKDIR /app

COPY --from=builder /app/main /app/main
COPY --from=builder /app/.env /app/.env

EXPOSE 10000

CMD ["/app/main"]