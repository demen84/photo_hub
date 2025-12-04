import { responseError } from "../helpers/function.helper.js";
import jwt from "jsonwebtoken";
import { statusCodes } from "../helpers/status-code.helper.js";

export const appError = (err, req, res, next) => {
   console.log("LỖI ĐẶC BIỆT:", err);

   // instanceof: so sánh giữa class với class
   if (err instanceof jwt.JsonWebTokenError) {
      err.statusCodes = statusCodes.UNAUTHORIZED; // 401: là mã để FE yêu cầu đăng nhập lại (logout người dùng).
   }

   if (err instanceof jwt.TokenExpiredError) {
      // console.log("TokenExpiredError");
      err.statusCodes = statusCodes.FORBIDDEN; // 403: là mã để FE refreshToken.
   }

   const response = responseError(err.message, err.statusCodes, err.stack);

   res.status(response.statusCode).json(response);
};
