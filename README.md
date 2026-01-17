# 🚀 Next.js 16 Advanced Authentication – Better-Auth, Prisma, Neon DB

A full production-ready authentication system built with **Next.js 16**, **Better-Auth**, **Prisma ORM**, **Neon PostgreSQL**, and **TypeScript** — featuring **Two-Factor Authentication**, **Email Verification**, **Role-Based Authorization**, **User Management**, **Profile Updates**, and more.

This repository contains the complete source code for the **5-hour full-stack tutorial** published on YouTube.

---

## ✨ Features

### 🔐 Authentication

- Email + Password Login
- Secure Sessions with Cookies
- Email Verification Flow
- Password Reset (Forgot Password)
- Two-Factor Authentication (OTP + TOTP)
- Rate Limiting

### 🔑 Authorization

- Role-Based Access Control (RBAC)
- Protected API Routes
- Server Action Security
- Admin/User Permissions

### 👤 User Management

- User Dashboard
- Admin Dashboard & User Table
- Update Profile (name, email, password)
- Manage Two-Factor Devices

### ⚙️ Technologies

- **Next.js 16** (App Router, Server Actions)
- **Better-Auth**
- **Prisma ORM**
- **Neon Serverless PostgreSQL**
- **TypeScript**
- **TailwindCSS + ShadCN UI**
- **React Email + Resend**
- **Zod Validation**

## 🛠️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Atiqullah-Naemi/https://github.com/Atiqullah-Naemi/betterauth-next
cd https://github.com/Atiqullah-Naemi/betterauth-next

pnpm install
```

## Set environment variables

```bash
  DATABASE_URL="postgresql://<your-neon-db-url>"
  BETTER_AUTH_SECRET="<your-secret>"
  BETTER_AUTH_URL="http://localhost:3000"
  RESEND_API_KEY="<your-resend-key>"
```
