/**
 * @author  Jose Alfredo Romero Gonzalez
 * @title   Full Stack Developer
 * @project Task Manager Pro
 * @year    2026
 */

import { Router } from "express";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";

const router = Router();

/**
 * @route  GET /api/tasks
 * @desc   Obtener todas las tareas del usuario autenticado
 * @access Private
 */
router.get("/", authenticate, getTasks);

/**
 * @route  GET /api/tasks/:id
 * @desc   Obtener una tarea por ID
 * @access Private
 */
router.get("/:id", authenticate, getTask);

/**
 * @route  POST /api/tasks
 * @desc   Crear una nueva tarea
 * @access Private
 */
router.post("/", authenticate, validate(createTaskSchema), createTask);

/**
 * @route  PUT /api/tasks/:id
 * @desc   Actualizar una tarea existente
 * @access Private
 */
router.put("/:id", authenticate, validate(updateTaskSchema), updateTask);

/**
 * @route  DELETE /api/tasks/:id
 * @desc   Eliminar una tarea
 * @access Private
 */
router.delete("/:id", authenticate, deleteTask);

export default router;
