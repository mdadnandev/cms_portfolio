# Portfolio & Custom Headless CMS — Complete Architecture & Specs

> **Architecture Update**: Modern White & Cobalt Blue design system. Standalone CMS Admin Panel isolated into its own repository (`cms-admin/`).

---

## 🏗️ Repositories Breakdown

```
/Volumes/mac-D/Adnan/Cms/
├── backend/                  # Java 21 Spring Boot Custom CMS REST API Repo
│   ├── pom.xml               # Maven configuration (Spring Boot, Security, JPA, JWT, Cloudinary)
│   └── src/main/resources/application.properties  # Connected to Supabase DB & Cloudinary CDN
├── frontend/                 # Next.js 14+ White & Royal Cobalt Blue Portfolio Repo
│   ├── public/hero-portrait.jpeg
│   └── src/app/page.tsx      # Portfolio Landing Page (Zero Admin links)
├── cms-admin/                # Standalone Vite/React CMS Admin Dashboard Repo
│   ├── src/App.tsx           # Standalone Admin Control Center (JWT Login + Full CRUD)
│   └── src/api.ts            # Connects to Spring Boot REST API
└── DOCUMENTATION.md
```

---

## 🔑 Production Live Credentials

### 1. Supabase PostgreSQL Database Configuration
- **Host**: `aws-0-ap-southeast-1.pooler.supabase.com`
- **Port**: `5432`
- **Database**: `postgres`
- **Username**: `postgres.ujcwensseevsbkdhnotv`
- **JDBC Connection**: `jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require`

### 2. Cloudinary CDN Storage Credentials
- **Cloud Name**: `tambvqrv`
- **API Key**: `297869423192439`
- **API Secret**: `YWQl-Sb1oAdwQkI2L2LFlZFhoMk`

---

## ⚡ Running All 3 Projects Separately

### 1. Spring Boot Backend (Port 8080)
```bash
cd /Volumes/mac-D/Adnan/Cms/backend
mvn spring-boot:run
```
👉 Live Production Backend: `https://cms-portfolio-0yaf.onrender.com`


### 2. Portfolio Website (Port 3000)
```bash
cd /Volumes/mac-D/Adnan/Cms/frontend
npm run dev
```
👉 URL: `http://localhost:3000`

### 3. Standalone CMS Admin Dashboard (Port 5173)
```bash
cd /Volumes/mac-D/Adnan/Cms/cms-admin
npm run dev
```
👉 URL: `http://localhost:5173` (Login: `admin` / `admin123`)
