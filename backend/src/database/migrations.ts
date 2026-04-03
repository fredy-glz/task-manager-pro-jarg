/**
 * @author  José Alfredo Romero González
 * @title   Full Stack Developer
 * @project Task Manager Pro
 * @year    2026
 */

import pool from "../config/db";

/**
 * Crea la tabla users si no existe.
 * Contiene la información de autenticación y rol de cada usuario.
 */
const createUsersTable = async (): Promise<void> => {
  const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id          INT PRIMARY KEY AUTO_INCREMENT,
            name        VARCHAR(100) NOT NULL,
            email       VARCHAR(150) NOT NULL UNIQUE,
            password    VARCHAR(255) NOT NULL,
            role        ENUM('admin', 'user') NOT NULL DEFAULT 'user',
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;

  await pool.execute(sql);
  console.log("✅ Table users ready");
};

/**
 * Crea la tabla tasks si no existe.
 * Depende de users — siemrpe debe crearse después de esa tabla
 * ya que user_id es una llave foránea que referencia a users.id
 */
const createTasksTable = async (): Promise<void> => {
  const sql = `
        CREATE TABLE IF NOT EXISTS tasks (
            id          INT PRIMARY KEY AUTO_INCREMENT,
            title       VARCHAR(150) NOT NULL,
            description TEXT,
            status      ENUM('todo', 'in_progress', 'done') NOT NULL DEFAULT 'todo',
            priority    ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
            due_date    DATE,
            user_id     INT NOT NULL,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
  await pool.execute(sql);
  console.log("✅ Table tasks ready");
};

/**
 * Ejecuta todas las migraciones en orden.
 * El orden importa — users debe crearse antes de tasks.
 * Si falla, detiene el servidor ya que sin tablas la app no puede funcionar.
 */
export const runMigrations = async (): Promise<void> => {
  try {
    console.log("⏳ Running migrations...");
    await createUsersTable();
    await createTasksTable();
    console.log("✅ All migrations completed");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};
