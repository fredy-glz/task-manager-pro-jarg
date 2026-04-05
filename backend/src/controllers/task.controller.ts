/**
 * @author  Jose Alfredo Romero Gonzalez
 * @title   Full Stack Developer
 * @project Task Manager Pro
 * @year    2026
 */

import { Response } from "express";
import { AuthRequest } from "../types";
import * as TaskModel from "../models/task.model";
import { success, error } from "../utils/response";

/**
 * Obtiene todas las tareas del usuario autenticado.
 * Si el usuario es admin, obtiene todas las tareas del sistema.
 */
export const getTasks = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const tasks = await TaskModel.getTaskByUser(req.user!.id, req.user!.role);
    res.status(200).json(success("Tasks retrieved successfully", tasks));
  } catch (err) {
    console.error("GetTasks error:", err);
    res.status(500).json(error("Internal server error"));
  }
};

/**
 * Obtiene una tarea por su ID
 * Verifica que la tarea exista y pertenezca al usuario autenticado,
 * a menos que sea admin.
 */
export const getTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const task = await TaskModel.getTaskById(Number(req.params.id));

    if (!task) {
      res.status(404).json(error("Task Not Found"));
      return;
    }

    // Un usuario normal solo pueder ver sus propias tareas
    if (req.user!.role !== "admin" && req.user!.id !== task.user_id) {
      res.status(403).json(error("Access denied"));
      return;
    }

    res.status(200).json(success("Task retrieved successfullt", task));
  } catch (err) {
    console.error("GetTask error: ", err);
    res.status(500).json(error("Internal server error"));
  }
};

/**
 * Crear una nueva tarea asociada al usuario autenticado.
 * El body ya viene validado por el middleware validate(createTaskSchema)
 */
export const createTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const taskId = await TaskModel.createTask(req.body, req.user!.id);
    const task = await TaskModel.getTaskById(taskId);
    res.status(201).json(success("Task created successfully", task));
  } catch (err) {
    console.error("CreateTask error:", err);
    res.status(500).json(error("Internal server error"));
  }
};

/**
 * Actualiza una tarea existente.
 * Verifica que la tarea exista y pertenezca al usuario autenticado.
 * El body ya viene validado por el middleware validate(updateTaskSchema)
 */
export const updateTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const task = await TaskModel.getTaskById(Number(req.params.id));
    if (!task) {
      res.status(404).json(error("Task not found"));
      return;
    }

    // un usuario normal solo puede editar sus propias tareas
    if (req.user!.role !== "admin" && task.user_id !== req.user!.id) {
      res.status(403).json(error("Access denied"));
      return;
    }

    // Mezclamos los datos actuales con los nuevos — solo actualizamos lo que cambió
    const updatedData = { ...task, ...req.body };
    await TaskModel.updatedTask(Number(req.params.id), updatedData);

    const updatedTask = await TaskModel.getTaskById(Number(req.params.id));
    res.status(200).json(success("Task updated successfully", updateTask));
  } catch (err) {
    console.error("UpdateTask error:", err);
    res.status(500).json(error("Internal server error"));
  }
};

/**
 * Elimina una tarea por su ID.
 * Verifica que la tarea exista y pertenezca al usuario autenticado.
 */
export const deleteTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const task = await TaskModel.getTaskById(Number(req.params.id));

    if (!task) {
      res.status(404).json(error("Task not found"));
      return;
    }

    // Un usuario normal solo puede eliminar sus propias tareas
    if (req.user!.role !== "admin" && task.user_id !== req.user!.id) {
      res.status(403).json(error("Access denied"));
      return;
    }

    await TaskModel.deleteTask(Number(req.params.id));
    res.status(200).json(success("Task deleted successfully"));
  } catch (err) {
    console.error("DeleteTask error:", err);
    res.status(500).json(error("Internal server error"));
  }
};
