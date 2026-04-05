/**
 * @author  Jose Alfredo Romero Gonzalez
 * @title   Full Stack Developer
 * @project Task Manager Pro
 * @year    2026
 */

import pool from "../config/db";
import { Task, TaskBody } from "../types";
import { RowDataPacket, ResultSetHeader } from "mysql2";

/**
 * Obtiene todas las tareas del usuarui autenticado.
 * Si el usuario es admin, obtiene todas las tareas del sistema.
 */

export const getTaskByUser = async (
  userId: number,
  role: string,
): Promise<Task[]> => {
  const [rows] =
    role === "admin"
      ? await pool.execute<RowDataPacket[]>(
          "SELECT * FROM tasks ORDER BY created_at DESC",
        )
      : await pool.execute<RowDataPacket[]>(
          "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
          [userId],
        );

  return rows as Task[];
};

/**
 * Busca una tarea por su ID.
 * Regresa null si no existe
 */
export const getTaskById = async (id: number): Promise<Task | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM tasks WHERE id = ?",
    [id],
  );

  return rows.length > 0 ? (rows[0] as Task) : null;
};

/**
 * Crea una nueva tarea asociada a un usuario.
 * Regresa el ID de la tarea recién creada.
 */
export const createTask = async (
  body: TaskBody,
  userId: number,
): Promise<number> => {
  const {
    title,
    description = "",
    status = "todo",
    priority = "medium",
    due_date = null,
  } = body;
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO tasks (title, description, status, priority, due_date, user_id) VALUES (?, ?, ?, ?, ?, ?)",
    [title, description, status, priority, due_date, userId],
  );

  return result.insertId;
};

/**
 * Actualiza una tarea por su ID.
 * Solo actualiza los campos que vengan en el body.
 */
export const updatedTask = async (
  id: number,
  body: TaskBody,
): Promise<void> => {
  const { title, description, status, priority, due_date } = body;
  await pool.execute<ResultSetHeader>(
    `UPDATE tasks
    SET title = ?, description = ?, status = ?, priority = ?, due_date = ? 
    WHERE id = ?`,
    [title, description, status, priority, due_date ?? null, id] as any[],
  );
};

/**
 * Elimina una tarea por su ID.
 */
export const deleteTask = async (id: number): Promise<void> => {
  await pool.execute<ResultSetHeader>("DELETE FROM tasks WHERE id = ?", [id]);
};
