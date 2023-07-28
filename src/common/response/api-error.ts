import { HttpException, HttpStatus } from '@nestjs/common';
export class ApiError extends HttpException {
  public meta;

  constructor(message: string, errorCode?: string, extraInfo?) {
    super(message, HttpStatus.BAD_REQUEST);
    this.meta = {
      msg: message || 'Internal server error',
      errorCode: errorCode || 'E-1',
      extraInfo: extraInfo || {},
      code: -1,
    };
  }

  static error(message: string, errorCode?: string, extraInfo?) {
    throw new ApiError(message, errorCode, extraInfo);
  }
}
