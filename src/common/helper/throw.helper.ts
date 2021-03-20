import { HttpStatus, HttpException } from '@nestjs/common';

export const customThrowError = (
  message: string,
  code: HttpStatus,
  errorCode?: string,
  error?: Error,
): void => {
  throw new HttpException({ message, errorCode, error }, code);
};
