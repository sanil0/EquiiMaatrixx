# EquiMatrix – Equity Award Tracker

## Overview
**EquiMatrix** is a modern full-stack web application designed to simplify and automate the management of employee equity awards such as **ESOPs** and **RSUs**.

It provides a **centralized and secure platform** for:
- **Equity lifecycle management**
- **Real-time valuation using market data**
- **Automated tax calculations**
- **Exercise request workflows**
- **Audit tracking and compliance**

---

## Key Features

### Employee Portal
- **Secure login** using JWT authentication  
- **Dashboard** with equity overview  
- **Vesting schedule visualization**  
- **Real-time valuation** using market data  
- **Automated tax calculation**  
- **Exercise request submission and tracking**  
- **Notifications and email alerts**  

---

### Admin Portal
- **Manage employees and equity awards**  
- **Approve or reject exercise requests**  
- **Audit logs and compliance tracking**  
- **Notification management system**  
- **Feedback and support handling**  

---

## System Capabilities
- **Real-time stock price integration** using Alpha Vantage API  
- **Automated tax calculation engine**  
- **Secure authentication** with JWT and BCrypt  
- **Audit logging for compliance**  
- **Email notifications** using Brevo API  

---

## Tech Stack

### Backend
- **.NET 8 (ASP.NET Core)**  
- **C#**  
- **Entity Framework Core**  
- **SQL Server (SQLEXPRESS)**  
- **JWT Authentication**  

### Frontend
- **Angular 19**  
- **TypeScript**  
- **Tailwind CSS**  
- **Angular Material**  

### External APIs
- **Alpha Vantage** – Market price data  
- **Brevo** – Email service  

---

## Project Structure

```
EquiMatrix/

├── BackEnd/        # ASP.NET Core Web API
├── FrontEnd/       # Angular Application
├── Database/       # SQL Scripts
└── README.md
```

---

## Getting Started

### Prerequisites
- **.NET 8 SDK**  
- **Node.js (v18 or higher)**  
- **Angular CLI**  
- **SQL Server (SQLEXPRESS or higher)**  
- **Alpha Vantage API Key**  
- **Brevo API Key**  

---

## Backend Setup

```bash
cd BackEnd
dotnet restore
dotnet build
dotnet run
```

---

## Frontend Setup

```bash
cd FrontEnd
npm install
ng serve
```

---

## Database Setup

Run the following commands:

```bash
dotnet ef migrations add InitialDb
dotnet ef database update
```

---

## User Secrets Configuration

Initialize secrets:

```bash
dotnet user-secrets init
```

Set API keys:

```bash
dotnet user-secrets set "EmailSettings:BrevoApiKey" "your_api_key"
dotnet user-secrets set "AlphaVantage:ApiKey" "your_api_key"
```

---

## Authentication
- **JWT (JSON Web Tokens)** for stateless authentication  
- **BCrypt hashing** for secure password storage  

---


