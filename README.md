# 📝 Task Manager APP

A full-featured **task management API** built with **Next.js**, featuring **user authentication** and **CRUD operations** for tasks.

---

## Installation

### Clone the repo
```bash
git clone https://github.com/iamshihab2020/task-manager-app.git
```

### Install Packages
```bash
npm install
```

### create a .env.local and add those
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run the project
```bash
npm run dev
```


## ✨ Time taken 
- Approximately **7.5** hours.  


## ✨ Features

- 🔐 **User Authentication**: Register, login, and logout with JWT tokens  
- ✅ **Task Management**: Create, read, update, and delete tasks  
- 🛡 **Secure**: Password hashing with bcrypt and HTTP-only cookies  
- 🧹 **Data Validation**: Comprehensive input validation for all endpoints  
- 🔎 **Search & Filtering**: Filter tasks by completion status and search by title/description  
- 📄 **Pagination**: Limit and offset support for task listings  

---

## 🛠 Tech Stack

- **Backend Framework**: Next.js 14+ (App Router)  
- **Database**: MongoDB with Mongoose ODM  
- **Authentication**: JWT tokens with HTTP-only cookies  
- **Password Hashing**: bcryptjs  
- **Validation**: Custom validation middleware  

---

## 📌 API Endpoints

#### **POST** `/api/auth/register`  
Register a new user.  

#### **POST** `/api/auth/login`  
Login an existing user.  

#### **POST** `/api/tasks`  
Create a new task.  

#### **GET** `/api/tasks`  
Gett all new task.  

#### **PUT** `/api/tasks`  
Update a task.  

#### **DELETE** `/api/tasks`  
Dekte a task.  

