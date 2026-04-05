/**
 * @author  Jose Alfredo Romero Gonzalez
 * @title   Full Stack Developer
 * @project Task Manager Pro
 * @year    2026
 */

import { z } from "zod";

/**
 * Esquema de validación para crear una tarea.
 * title es el único campo obligatorio
 */
export const createTaskSchema = z.object({
  title: z
    .string("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be at most 150 characters"),

  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),

  status: z
    .enum(["todo", "in_progress", "done"] as const, {
      error: "Status must be todo, in_progresss or done",
    })
    .optional(),

  priority: z
    .enum(["low", "medium", "high", "critical"] as const, {
      error: "Priority must be low, medium, high or critical",
    })
    .optional(),

  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in format YYYY-MM-DD")
    .optional(),
});

/**
 * Esquema de validación para actualizar una tarea.
 * Todos los campos son opcionlaes gracias a .partial();
 */
export const updateTaskSchema = createTaskSchema.partial();

/** Tipos inferidos automáticamente por Zod — ya no necesitas definirlos a mano */
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
