# Medicare - Online Pharmacy Platform

Hệ thống bán thuốc tây trực tuyến

## 🏗️ System Architecture Overview

### **DevOps & Infrastructure**
- **🐳 Docker** - Containerization cho tất cả services
- **📊 Portainer** - Container management với custom registry
- **🔧 Jenkins** - CI/CD automation pipeline
- **🔐 HashiCorp Vault** - Secrets management system
- **☁️ VPS** - Single server hosting all services
- **🌐 Nginx** - Reverse proxy & load balancer
- **📂 GitHub** - Source code management

### **Cloud Services**
- **☁️ AWS S3** - Image storage & management
- **📧 SendGrid** - Email delivery service (Gmail student account)
- **💳 SePay** - Banking integration for payments
- **🤖 GPT-4 API** - AI recommendations & features

### **Databases & Message Queue**
- **🍃 MongoDB** - Primary database
- **🔍 Elasticsearch** - Search & analytics
- **⚡ Redis** - Caching & session storage
- **🐰 RabbitMQ** - Message queue system

## 🎯 Frontend Architecture

### **Technology Stack**
```typescript
- NextJS 14 (App Router)
- TypeScript (Type safety)
- Tailwind CSS (Styling)
- Redux Toolkit (State management)
- Redux-Saga (Side effects)
```

### **API Integration**
- **tracking-api** - Core business logic & operations
- **recommendation** - AI-powered product recommendations

## 🔧 Backend Services (tracking-manager)

### **Service Overview**
```
tracking-manager/
├── packages/
│   ├── tracking-api/     # Core API service
│   ├── payment/          # Payment processing
│   ├── recommendation/   # AI recommendations
│   ├── consumer/         # Queue processing
│   └── hook/            # Shipping status updates
```

### **1. tracking-api (FastAPI + Python)**
**Purpose:** Core business logic & consumer operations

**Dependencies:**
```python
- FastAPI framework
- MongoDB (primary database)
- Elasticsearch (search/analytics)
- Redis (caching)
- AWS S3 (image storage)
```

### **2. payment (FastAPI + Python)**
**Purpose:** Payment processing & SePay integration

**Dependencies:**
```python
- FastAPI framework
- SePay API integration
- MongoDB (transaction records)
- Redis (payment sessions)
```

### **3. recommendation (FastAPI + Python + GPT-4)**
**Purpose:** AI-powered product recommendations

**Dependencies:**
```python
- FastAPI framework
- OpenAI GPT-4 API
- MongoDB (user behavior)
- Redis (recommendation cache)
```

### **4. consumer (Go)**
**Purpose:** RabbitMQ queue processing

**Dependencies:**
```go
- Go runtime
- RabbitMQ client
- MongoDB driver
```

### **5. hook (Go)**
**Purpose:** Shipping status webhook handler

**Dependencies:**
```go
- Go runtime
- HTTP server
- MongoDB driver
```

## 📝 API Documentation

### **Swagger/OpenAPI**
- **tracking-api**: `https://tracking-api.medicaretech.io.vn/docs`
- **payment**: `https://payment.medicaretech.io.vn/docs`  
- **recommendation**: `https://recommendation.medicaretech.io.vn/docs`

---

> **System Status:** Production Ready ✅  
> **Live Demo:** [https://shop.medicaretech.io.vn](https://shop.medicaretech.io.vn)