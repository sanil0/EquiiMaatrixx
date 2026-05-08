EquiMatrix – Equity Award Tracker

Overview
EquiMatrix is a modern, full-stack web application designed to simplify and automate the management of employee equity awards such as ESOPs and RSUs.
It provides a centralized platform for:

Equity lifecycle management
Real-time valuation using market data
Automated tax calculations
Exercise request workflows
Secure authentication & audit tracking

Features

Employee Features

Secure login with JWT authentication
Dashboard with equity overview
Vesting schedule visualization
Real-time tax calculation
Submit exercise requests
Notifications & email alerts

🛠️ Admin Features

Manage employees & awards
Approve/reject exercise requests
Audit logs and tracking
Notification management
Feedback and support handling

System Capabilities

Real-time stock price integration (Alpha Vantage API)
Automated tax calculation engine
Secure authentication (JWT + BCrypt)
Audit logging for compliance
Email notifications via Brevo API


🏗️ Tech Stack

Backend

.NET 8 (ASP.NET Core)
C#
Entity Framework Core
SQL Server (SQLEXPRESS)
JWT Authentication

Frontend

Angular 17
TypeScript
Tailwind CSS
Angular Material

External APIs

Alpha Vantage (Market Prices)
Brevo (Email Service)

Project Structure

EquiMatrix/

├── BackEnd/        # .NET Web API

├── FrontEnd/       # Angular App

├── Database/       # SQL Scripts

└── README.md
