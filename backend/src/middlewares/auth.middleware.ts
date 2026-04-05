/**
 * @author  Jose Alfredo Romero Gonzalez
 * @title   Full Stack Developer
 * @project Task Manager Pro
 * @year    2026
 */

import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload } from "../types";
import { error } from "../utils/response";

/**
 * Middleware que verifica el token JWT en el header de la petición.
 * Si el token es válido, agrega el usuario decodificado a req.user
 * y deja pasar la petición al siguiente middleware o controlador.
 * Si no, rechaza la petición con un 401.
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // ── Extraer el token del header ──────────────────────────────────────────
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json(error("No token provided"));
      return;
    }

    // El header viene como "Bearer eyJhbGci..." —  solo necesitamos la segunda parte
    const token = authHeader.split(" ")[1];

    // ── Validación extra — por si viene "Bearer " sin token ──────────────────
    if (!token || token.trim() === "") {
      res.status(402).json(error("No token provided"));
      return;
    }

    // ── Verificar y decodificar el token ─────────────────────────────────────
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    // Agregamos el usuario decodificado al request para usarlo en los constroladores
    req.user = decoded;

    // Todo bien — dejamos pasar la petición
    next();
  } catch (err) {
    // jwt.verify lanza un error si el token es inválido o expiró
    res.status(401).json(error("Invalid or expired token"));
  }
};

/**
 * Middleware que verifica que el usuario autenticado tenga rol de admin.
 * Siempre debe usarse después de authenticate, nunca solo.
 */
export const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== "admin") {
    res.status(403).json(error("Access denied - Admins only"));
    return;
  }
  next();
};
