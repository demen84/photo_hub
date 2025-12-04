import { statusCodes } from "./status-code.helper.js";

//https://docs.nestjs.com/exception-filters#throwing-standard-exceptions

export class BadRequestException extends Error {
   constructor(message = "BadRequestException") {
      super(message);
      this.statusCodes = statusCodes.BAD_REQUEST; // 400
   }
}

export class UnAuthorizedException extends Error {
   constructor(message = "UnAuthorizedException") {
      super(message);
      this.statusCodes = statusCodes.UNAUTHORIZED; // 401
   }
} // Nếu là 401 thì cho out user luôn (logout)

export class ForbiddenException extends Error {
   constructor(message = "ForbiddenException") {
      super(message);
      this.statusCodes = statusCodes.FORBIDDEN; // 403
   }
} // Nếu là 403 thì sẽ cho refresh token

export class ManyRequestException extends Error {
   constructor(message = "ManyRequestException") {
      super(message);
      this.statusCodes = statusCodes.TOO_MANY_REQUESTS; // 429
   }
}
