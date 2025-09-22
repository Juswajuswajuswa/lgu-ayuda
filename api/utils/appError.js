export class AppError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
    this.isOperational = true;
  }
}
