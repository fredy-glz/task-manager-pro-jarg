/**
 * @author  Jose Alfredo Romero Gonzalez
 * @title   Full Stack Developer
 * @project Task Manager Pro
 * @year    2026
 */

import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { error } from "../utils/response";

/**
 * Middleware genérico de validación con Zod.
 * Recibe un esquema y valida el body de la petición antes de
 * que llegue al controlador. Si falla, rechaza con 400.
 * Si pasa, reemplaza req.body con los datos validados y tipados.
 */

export const validate =
  (schema: z.ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      res
        .status(400)
        .json(
          error("Validation error", fieldErrors as Record<string, string[]>),
        );
      return;
    }

    // Reemplazamos el body con los datos ya validados y tipados por Zod
    req.body = result.data;
    next();
  };
