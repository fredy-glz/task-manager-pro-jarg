/**
 * @author  Jose Alfredo Romero Gonzalez
 * @title   Full Stack Developer
 * @project Task Manager Pro
 * @year    2026
 */

import { Router } from "express";
import { register, login } from "../controllers/auth.controller";

const router = Router();

/**
 * @route  POST /api/auth/register
 * @desc   Registrar un nuevo usuario
 * @access Public
 */
router.post("/register", register);

/**
 * @route  POST /api/auth/login
 * @desc   Autenticar usuario y obtener token
 * @access Public
 */
router.post("/login", login);

export default router;
