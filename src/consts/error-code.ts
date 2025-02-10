import { HttpErrorCode } from '~/libs';

export const ErrorCodeToStatusMap: Record<HttpErrorCode, number> = {
  [HttpErrorCode.UNAUTHORIZED]: 401,
  [HttpErrorCode.NOT_FOUND]: 404,
  [HttpErrorCode.TOO_MANY_REQUESTS]: 429,
  [HttpErrorCode.INTERNAL_SERVER_ERROR]: 500,
  [HttpErrorCode.DATABASE_CONNECTION_UNAVAILABLE]: 503,
  [HttpErrorCode.GATEWAY_TIMEOUT]: 504,
  [HttpErrorCode.UNKNOWN_ERROR_CODE]: 500,
};
