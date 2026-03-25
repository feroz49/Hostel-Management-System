# Hostel Management System

This repository contains a full-stack application for managing a hostel. It is split into three main areas:

```
hostel-management-system
│
├── frontend
│   │
│   ├── public
│   │   └── index.html
│   │
│   ├── src
│   │   │
│   │   ├── assets
│   │   │   ├── images
│   │   │   └── icons
│   │   │
│   │   ├── components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Table.tsx
│   │   │
│   │   ├── pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Students.tsx
│   │   │   ├── Rooms.tsx
│   │   │   ├── Payments.tsx
│   │   │   ├── Complaints.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   │
│   │   ├── layouts
│   │   │   └── MainLayout.tsx
│   │   │
│   │   ├── services
│   │   │   └── api.ts
│   │   │
│   │   ├── routes
│   │   │   └── AppRoutes.tsx
│   │   │
│   │   ├── styles
│   │   │   └── global.css
│   │   │
│   │   ├── types
│   │   │   └── index.ts
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── tsconfig.json
│
│
├── backend
│   │
│   ├── src
│   │   │
│   │   ├── controllers
│   │   │   ├── authController.js
│   │   │   ├── studentController.js
│   │   │   ├── roomController.js
│   │   │   └── paymentController.js
│   │   │
│   │   ├── routes
│   │   │   ├── authRoutes.js
│   │   │   ├── studentRoutes.js
│   │   │   ├── roomRoutes.js
│   │   │   └── paymentRoutes.js
│   │   │
│   │   ├── models
│   │   │   ├── User.js
│   │   │   ├── Student.js
│   │   │   ├── Room.js
│   │   │   └── Payment.js
│   │   │
│   │   ├── middleware
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── config
│   │   │   └── db.js
│   │   │
│   │   ├── utils
│   │   │   └── helper.js
│   │   │
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
│
├── database
│   └── HostelDB.sql
│
└── README.md
```

## Setup Instructions

### Frontend

1. Navigate to `frontend` directory.
2. Run `npm install` to install dependencies.
3. Start the development server with `npm run dev` (or `npm start` depending on the framework setup).

### Backend

1. Navigate to `backend` directory.
2. Create a `.env` file with database connection and JWT secret.
3. Run `npm install`.
4. Start the server with `node src/server.js` or `npm run dev`.

### Database

- The SQL schema and sample data live in `database/HostelDB.sql`.
- Execute the file against your SQL Server instance to create tables and insert test data.

## Project Overview

- **Frontend:** React/TypeScript application with components and pages for dashboard, student management, rooms, payments, complaints, login, and registration.
- **Backend:** Node/Express API that handles authentication, student/room/payment CRUD operations and uses the database schema defined above.

Feel free to expand or modify the structure to suit your needs.# Hostel-Management-System
