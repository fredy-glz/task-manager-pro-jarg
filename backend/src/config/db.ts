/**
 * @author  José Alfredo Romero González
 * @title   Full Stack Developer
 * @project Task Manager Pro
 * @year    2026
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

/**
 * Pool de conexion a MySQL.
 * Usa múltiples conexiones simultáneas en lugar de una sola,
 * lo que mejora el rendimiento bajo carga.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Espera si no hay conexiones disponibles
  connectionLimit: 10, // Máximo de conexiones simultáneas
  queueLimit: 0, // Si límite en la cola de espera
});

/**
 * Verifica que la conexión a la BD sea exitosa al arrancar el servidor.
 * Si falla, detiene el servidor con process.exit(1) ya que
 * sin base de datos la app no puede funcionar.
 */
export const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL connected succesfully");
    // Regresamos la conexión al pool para que otros puedan usarla
    connection.release();
  } catch (error) {
    console.error("❌ MySQL connection failed: ", error);
    process.exit(1);
  }
};

export default pool;
