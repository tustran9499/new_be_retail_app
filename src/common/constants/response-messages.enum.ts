export enum RESPONSE_MESSAGES {
  LOGIN_FAIL = 'Login fail',
  CREATE_ERROR = 'Can not create user',
  EMAIL_EXIST = 'Email existed',
  USERNAME_EXIST = 'Username existed',
  INVALID = 'invalid',
  ERROR = 'An error occurred please try again later',
  EMAIL_SEND_FAIL = 'Mail send fail, please try again later',
  NOT_FOUND = 'Not found',
  SELF_DELETE = 'Cannot delete yourself',
  DELETED_ACCOUNT = 'Account has been deleted',
  EMAIL_NOT_VERIFY = 'Email has not been verified',
  PHONE_INPUT_TOO_LONG = 'Phone number is too long',
  WRONG_PHONE_NUMBER_FORMAT = 'Wrong phone number format',
  ACCOUNT_NOT_FOUND = 'Account not found',
}

export enum RESPONSE_EXPLAINATION {
  GET_ACCOUNT = 'The first return are Account, the second is total Account - Pagination done - Sort have not finished',
}

export enum RESPONSE_MESSAGES_CODE {
  LOGIN_FAIL = 'LOGIN_FAIL',
  CREATE_ERROR = 'CREATE_ERROR',
  EMAIL_EXIST = 'EMAIL_EXIST',
  USERNAME_EXIST = 'USERNAME_EXIST',
  INVALID = 'INVALID',
  ERROR = 'ERROR',
  EMAIL_SEND_FAIL = 'EMAIL_SEND_FAIL',
  NOT_FOUND = 'NOT_FOUND',
  SELF_DELETE = 'SELF_DELETE',
  DELETED_ACCOUNT = 'DELETED_ACCOUNT',
  EMAIL_NOT_VERIFY = 'EMAIL_NOT_VERIFY',
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
}
