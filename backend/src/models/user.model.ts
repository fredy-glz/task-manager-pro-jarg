/**
 * @author  Jose Alfredo Romero Gonzalez
 * @title   Full Stack Developer
 * @project Task Manager Pro
 * @year    2026
 */

import pool from "../config/db";
import { User } from "../types";

/**
 * Busca un usuario por email.
 * Se usa en el login para verificar si el usuario existe.
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows]: any = await pool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email],
  );
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Busca un usuario por su ID.
 * Se usa en el middleware de auth para verificar el token JWT.
 */
export const findUserById = async (id: number): Promise<User | null> => {
  const [rows]: any = pool.execute(
    "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?",
    [id],
  );

  return rows.length > 0 ? rows[0] : null;
};

/**
 * Crea un nuevo usuario en la BD.
 * La contraseña que llega aquí ya debe venir encriptada con bcrypt.
 * Regresa el ID del usuario recién insertado.
 */
export const createUser = async (
  name: string,
  email: string,
  password: string,
): Promise<number> => {
  const [result]: any = await pool.execute(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
  );
  // insertId es el ID autogenerado por MySQL del registro recién insertado
  return result.insertId;
};
