import type { Request, Response, NextFunction } from "express";
import { NotFoundError } from "@/utils/http-errors.util.js";

// /src/error-handlers/non-existing-routes.error-handler.ts
export function nonExistingRoutesErrorHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error = new NotFoundError(
    "Not Found: The route you requested does not exist."
  );
  next(error);
}
