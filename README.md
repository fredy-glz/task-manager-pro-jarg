# Task Manager Pro 🗂️

Gestor de tareas full-stack con roles, tablero drag & drop y estadísticas.

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Node](https://img.shields.io/badge/Node.js-24+-green)
![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react)

## Tech Stack

**Backend:** Node.js, Express, Typescript, MySQL  
**Frontend:** React, Typescript, Vite, CSS nativo  
**Auth:** JWT + bcrypt

## Features

- ✅ Autenticación (register / login)
- ✅ Roles (admin / usuario)
- ✅ Crear, editar y eliminar tareas
- ✅ Niveles de prioridad (baja / media / alta / crítica)
- ✅ Tablero drag & drop (Por hacer → En progreso → Hecho)
- ✅ Dashboard con estadísticas
- ✅ Fechas límite y alertas de vencimiento
- ✅ Filtros y búsqueda

## Estrutura del proyecto

```
task-manager-pro/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── task.controller.ts
│   │   ├── middlewares/
│   │   │   └── auth.middleware.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   └── task.model.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── task.routes.ts
│   │   └── index.ts
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts
│   │   ├── components/
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskBoard.tsx
│   │   │   └── Navbar.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   └── useTasks.ts
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Requisitos

- MySQL 8+
- Node.js 24+
- React 19+

### Backend

```bash
cd backend
npm install
cp .env.example .env  # llena tus variables
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/register | Registrar usuario |
| POST | /api/auth/login | Inicar sesión |
| GET | /api/tasks | Obtener tareas |
| POST | /api/tasks | Crear tarea |
| PUT | /api/tasks/:id | Actualizar tarea |
| DELETE | /api/tasks/:id | Eliminar tarea |

## Deploy

| Servicio | Plataforma |
|----------|------------|
| Backend + DB | Railway |
| Frontend | Vercel |