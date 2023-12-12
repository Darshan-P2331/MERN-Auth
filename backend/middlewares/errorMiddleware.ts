import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { CastError } from "mongoose";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = error?.message;

  if (error.name === "CastError" && error.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource Not Found";
  }
  console.log("first")

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
  next(error)
};

export { notFound, errorHandler };
