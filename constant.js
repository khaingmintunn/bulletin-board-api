module.exports.ERROR = {
  INTERNAL_SERVER: 'Internal Server Error.',
  SIGNUP: 'An error occurred during signup process.',
  SIGNUP_CONFIRM: 'An error occurred during signup confirm process.',
  LOGIN: 'An error occurred during login process.',
  LOGOUT: 'An error occurred during logout process.',
  FORGET_PASSWORD: 'An error occurred during forget password process.',
  RESET_PASSWORD: 'An error occurred during reset password process.',
  PROFILE: 'An error occurred during retrieving profile process.',
  PROFILE_UPDATE: 'Am error occurred during updating profile process.',
  EMAIL_UPDATE: 'An error occurred during updating email process.',
  EMAIL_UPDATE_CONFIRM:
    'An error occurred during confirmation email update process.',
  PASSWORD_UPDATE: 'An error occurred during updating password process.',
  POST_LIST: 'An error occurred during retrieving post list process.',
  POST: 'An error occurred during retrieving post process.',
  POST_CREATE: 'An error occurred during creating post process.',
  POST_UPDATE: 'An error occurred dring updating post process.',
  POST_DELETE: 'An error occurred during deleting post process.',
  USER_LIST: 'An error occurred during retireving user list process.',
  USER: 'An error occurred during retrieving user process.',
  USER_CREATE: 'An error occurred during creating user process.',
  USER_SUSPEND: 'An error occurred during suspending user process.',
  USER_DELETE: 'An error occurred during deleting user process.',
  USER_EXIST_MESSAGE: 'User already exists.',
  USER_SUSPEND_MESSAGE: 'User was suspended.',
  EXPIRED_MESSAGE: 'Expired token.',
  TOKEN_NOT_FOUND: 'Token Not Found.',
  USER_NOT_FOUND: 'User Not Found.',
  NEED_AUTH: 'User is need to authenticate.',
  INCORRECT_PASSWORD: 'Incorrect password, please try again.',
  INCORRECT_CURRENT_PASSWORD: 'Current password is incorrect.',
  NO_AUTH: 'User not login, please login first.',
  PERMISSION: 'You have no permission to use this service.',
  NOT_SUSPEND: "Can't suspend no authenticated user."
}

module.exports.USER_TYPE = {
  ADMIN: 'ADMIN',
  USER: 'USER',
}

module.exports.AUTH_STATUS = {
  NO_AUTH: 'NO_AUTH',
  AUTHED: 'AUTHED',
  SUSPENDED: 'SUSPENDED',
}

module.exports.TOKEN_TYPE = {
  SIGNUP: 'SIGNUP',
  AUTH: 'AUTH',
  PASSWORD_RESET: 'PASSWORD_RESET',
  EMAIL_UPDATE: 'EMAIL_UPDATE',
}
