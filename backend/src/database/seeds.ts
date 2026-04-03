/**
 * @author  José Alfredo Romero González
 * @title   Full Stack Developer
 * @project Task Manager Pro
 * @year    2026
 */

import pool from "../config/db";
import bcrypt from "bcryptjs";

/**
 * Inserta usuarios de prueba en la DB.
 * Si ya existen registros, omite la inserción (idempotente).
 */
const seedUsers = async (): Promise<void> => {
  const [rows]: any = await pool.execute("SELECT COUNT(*) as count FROM users");
  if (rows[0].count > 0) {
    console.log("⏭️ Users already seeded, skipping...");
    return;
  }

  // El 10 representa los salt rounds — estándar recomendado para producción
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = [
    ["Admin User", "admin@taskmanager.com", hashedPassword, "admin"],
    ["John Doe", "john@taskmanager.com", hashedPassword, "admin"],
    ["Jane Doe", "jane@taskmanager.com", hashedPassword, "admin"],
  ];

  for (const user of users) {
    await pool.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      user,
    );
  }

  console.log("✅ Users seeded");
};

/**
 * Inserta tareas de prueba en la DB asociadas a los usuarios seed.
 * Si ya existen registros, omite la inserción (idempotente).
 */
const seedTasks = async (): Promise<void> => {
  const [rows]: any = await pool.execute("SELECT COUNT(*) as count FROM tasks");
  if (rows[0].count > 0) {
    console.log("⏭️ Tasks already seeded, skipping...");
    return;
  }

  // Obtiene los IDs de los usuarios recién insertados
  const [users]: any = await pool.execute("SELECT id FROM users");
  const adminId = users[0].id;
  const johnId = users[1].id;
  const janeId = users[2].id;

  const tasks = [
    [
      "Setup project repository",
      "Initialize backend and frontend structure",
      "done",
      "high",
      "2026-04-10",
      adminId,
    ],
    [
      "Design database schema",
      "Define tables, relations and indexes",
      "done",
      "high",
      "2026-04-11",
      adminId,
    ],
    [
      "Implement authentication",
      "JWT login and register endpoints",
      "in_progress",
      "critical",
      "2026-04-15",
      adminId,
    ],
    [
      "Build task CRUD API",
      "Create all task endpoints with validation",
      "todo",
      "high",
      "2026-04-20",
      adminId,
    ],
    [
      "Create dashboard UI",
      "Stats cards and charts for the dashboard",
      "todo",
      "medium",
      "2026-04-25",
      johnId,
    ],
    [
      "Implement drag and drop",
      "Board with drag and drop between columns",
      "todo",
      "medium",
      "2026-04-28",
      johnId,
    ],
    [
      "Write API documentation",
      "Swagger docs for all endpoints",
      "todo",
      "low",
      "2026-05-01",
      johnId,
    ],
    [
      "Setup CI/CD pipeline",
      "Automate deploy on push to main",
      "todo",
      "low",
      "2026-05-05",
      janeId,
    ],
    [
      "Add unit tests",
      "Test auth and task controllers",
      "todo",
      "medium",
      "2026-05-10",
      janeId,
    ],
    [
      "Deploy to production",
      "Railway for backend, Vercel for frontend",
      "todo",
      "critical",
      "2026-05-15",
      janeId,
    ],
  ];

  for (const task of tasks) {
    // Los ? previenen SQL Injection — nunca se concatenan valores directos en el query
    await pool.execute(
      "INSERT INTO tasks (title, description, status, priority, due_date, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      task,
    );
  }

  console.log("✅ Tasks seeded.");
};

/**
 * Ejecuta todos los seeds en orden.
 * Primero usuarios, luego tareas (por la dependencia de user_id).
 * Sil falla, solo muestra el error — no detiene el servidor.
 */
export const runSeeds = async (): Promise<void> => {
  try {
    console.log("⏳ Running seeds...");
    await seedUsers();
    await seedTasks();
    console.log("✅ All seeds completed");
  } catch (error) {
    // Las seeds son opcionales — un fallo aquí no debe bajar el servidor
    console.error("⚠️ Seeds failed (non-critical):", error);
  }
};
