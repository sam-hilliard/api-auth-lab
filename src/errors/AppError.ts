export class AppError extends Error {
  public readonly statusCode: number;
  public readonly trace?: Error;

  constructor(statusCode: number, message: string, trace?: Error) {
    super(message);

    this.statusCode = statusCode;
    this.trace = trace;
  }
}
