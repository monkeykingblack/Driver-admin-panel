export type IHttpError = {
  message: string;
  status: number;
  code: string;
  data?: unknown;
};

export enum HttpErrorCode {
  // 401 - Given the bearer token used, the client doesn't have permission to perform this operation.
  UNAUTHORIZED = 'unauthorized',
  // 404 - Given the bearer token used, the resource does not exist. This error can also indicate that the resource has not been shared with owner of the bearer token.
  NOT_FOUND = 'not_found',
  // 429 - The user has reached the limit of the number of requests that can be made in the current instance.
  TOO_MANY_REQUESTS = 'too_many_requests',
  // 500 - An unexpected error occurred.
  INTERNAL_SERVER_ERROR = 'internal_server_error',
  // 503 - database is unavailable or is not in a state that can be queried. Please try again later.
  DATABASE_CONNECTION_UNAVAILABLE = 'database_connection_unavailable',
  // 504 - The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server it needed to access in order to complete the request.
  GATEWAY_TIMEOUT = 'gateway_timeout',
  // Unknown error code
  UNKNOWN_ERROR_CODE = 'unknown_error_code',
}
