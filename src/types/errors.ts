export type OperationKind = 'search' | 'weather';

export type AppErrorCode = 'network' | 'timeout' | 'service' | 'invalid-data';

export interface AppError {
  operation: OperationKind;
  code: AppErrorCode;
  message: string;
  recoverable: true;
}
