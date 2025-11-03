# 🚀 Collaborative Project Management Backend

This is the **backend** of a collaborative project management application built using **Node.js**, **Express**, **TypeScript**, and **MongoDB**.  
It allows authenticated users to create projects, add members, assign tasks, and manage task progress — with role-based access control (leader vs member).

---

## 🧩 Features

- 🔐 JWT-based Authentication (Login/Register)
- 🧠 Role-based access (Leader & Member)
- 📁 Project Management (Create, Read, Delete)
- 👥 Member Management (Add/Remove Members)
- ✅ Task Management (Assign, Update Status, Delete)
- 🗄️ MongoDB + Mongoose ODM
- 🧰 TypeScript with Express
- 🌐 RESTful API Architecture

---

## 🛠️ Tech Stack

| Category | Technology |
|-----------|-------------|
| Language | TypeScript |
| Framework | Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | JWT |
| Environment Management | dotenv |
| Development Tools | Nodemon, ts-node, concurrently |

---

## 📂 Folder Structure

```
backend/
│
├── src/
│   ├── config/           # Database configuration
│   ├── controller/       # Controller logic (Project, Task, User)
│   ├── middleware/       # Auth middleware
│   ├── models/           # Mongoose Schemas
│   ├── routes/           # API routes
│   ├── utils/            # Helper utilities
│   └── index.ts          # App entry point
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/project-management-backend.git
cd project-management-backend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file and fill in the variables mentioned above.

### 4️⃣ Run in Development Mode
```bash
npm run dev
```

### 5️⃣ Build & Run in Production
```bash
npm run build
npm start
```

---

## 📡 API Endpoints Overview

### 🔑 Authentication
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### 🧱 Projects
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/project/create` | Create a new project (Leader only) |
| GET | `/api/project` | Get all projects for logged-in user |
| DELETE | `/api/project/:id` | Delete a project (Leader only) |
| POST | `/api/project/:id/add-member` | Add member to a project (Leader only) |

### ✅ Tasks
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/task/create` | Create new task (Leader only) |
| GET | `/api/task/:projectId` | Get all tasks for a project |
| PUT | `/api/task/:id` | Update task status (Leader or assigned member) |
| DELETE | `/api/task/:id` | Delete task (Leader only) |

---

## 🧪 Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Run in development mode |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled JavaScript (production) |

---

## 💡 Future Plans

- Frontend integration (React + TypeScript + Tailwind)
- Realtime task updates (Socket.IO)
- Notifications and comments system
- File uploads for tasks

---

