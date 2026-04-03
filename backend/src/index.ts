/**
 * @author  José Alfredo Romero González
 * @title   Full Stack Developer
 * @project Task Manager Pro
 * @year    2026
 */

import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./config/db";
import { runMigrations } from "./database/migrations";
import { runSeeds } from "./database/seeds";

// Carga las variables de entorno antes que cualquier otra cosa
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares globales ────────────────────────────────────────────────────

// Permite peticiones desde otros orígenes (frontend en otro puerto)
app.use(cors());

// Parsea el body de las peticiones entrantes como JSON
app.use(express.json());

// ─── Rutas ───────────────────────────────────────────────────────────────────

/**
 * Health Check — Verifica que el servidor está corriendo.
 * Usado por Railway y otros servicios de hosting para monitoreo.
 */
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "Task Manager Pro API running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// ─── Arranque del servidor ───────────────────────────────────────────────────

/**
 * Inicia el servidor y ejecuta en orden:
 * 1. Verifica conexión a MySQL
 * 2. Corre migraciones (crea tablas si no existen)
 * 3. Corre seeds (inserta datos de prueba so no existen)
 */
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await testConnection();
  await runMigrations();
  await runSeeds();
});
