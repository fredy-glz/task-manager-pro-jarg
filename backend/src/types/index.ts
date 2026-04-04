/**
 * @author  Jose Alfredo Romero Gonzalez
 * @title   Full Stack Developer
 * @project Task Manager Pro
 * @year    2026
 */

import { Request } from "express";

// ─── Usuarios ────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  created_at: Date;
  updated_at: Date;
}

/** Datos que llegan en el body al registrar un usuario */
export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

/** Datos que llegan en el body al hacer login */
export interface LoginBody {
  email: string;
  password: string;
}

// ─── Tareas ──────────────────────────────────────────────────────────────────

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high" | "critical";
  due_date: Date;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

/** Datos que llegan en el body al crear o actualizar una tarea */
export interface TaskBody {
  title: string;
  description?: string;
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high" | "critical";
  due_date?: string;
}

// ─── JWT ─────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

/**
 * Extendemos el Request de Express para agregar el usuario autenticado.
 * Así en cualquier ruta protegida puedes acceder al req.user directamente.
 */
export interface AuthRequest extends Request {
  user?: JwtPayload;
}
