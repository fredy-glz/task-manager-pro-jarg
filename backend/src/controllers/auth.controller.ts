/**
 * @author  Jose Alfredo Romero Gonzalez
 * @title   Full Stack Developer
 * @project Task Manager Pro
 * @year    2026
 */

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/user.model";
import { RegisterBody, LoginBody } from "../types";

/**
 * Registra un nuevo usuario en la BD.
 * Verifica que el email no esté en uso, encripta la contraseña
 * y regresa un token JWT listo para usar.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password }: RegisterBody = req.body;

    // ── Validación básica de campos ──────────────────────────────────────────
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
      return;
    }

    // ── Verificar que el email no esté en uso ────────────────────────────────
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    // ── Encriptar contraseña y crear usuario ─────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser(name, email, hashedPassword);

    // ── Generar token JWT ────────────────────────────────────────────────────
    const token = jwt.sign(
      { id: userId, name, email, role: "user" },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any },
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Autentica un usuario existente.
 * Verifica que el email exista y que la contraseña sea correcta,
 * luego regresa un token JWT.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginBody = req.body;

    // ── Validación básica de campos ──────────────────────────────────────────
    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // ── Verificar que el usuario existe ──────────────────────────────────────
    const user = await findUserByEmail(email);
    if (!user) {
      // Mensaje genérico intencional - no revelamos si el email existe o no
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // ── Verificar contraseña ─────────────────────────────────────────────────
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // ── Generar token JWT ────────────────────────────────────────────────────
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any },
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
