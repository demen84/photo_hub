import { responseError } from "../helpers/function.helper.js";
import jwt from "jsonwebtoken";
import { statusCodes } from "../helpers/status-code.helper.js";
import { Prisma } from "@prisma/client";
import { NODE_ENV } from "../constant/app.constant.js";

export const appError = (err, req, res, next) => {
   console.log("LỖI ĐẶC BIỆT:", err);

   // 1. Bắt lỗi JWT (instanceof: so sánh giữa class với class)
   if (err instanceof jwt.JsonWebTokenError) {
      err.statusCodes = statusCodes.UNAUTHORIZED; // 401: là mã để FE yêu cầu đăng nhập lại (logout người dùng).
   }

   if (err instanceof jwt.TokenExpiredError) {
      // console.log("TokenExpiredError");
      err.statusCodes = statusCodes.FORBIDDEN; // 403: là mã để FE refreshToken.
   }

   // 2. Bắt lỗi kiểu dữ liệu từ Prisma (Int & String)
   if (err instanceof Prisma.PrismaClientValidationError) {
      let message = "Dữ liệu gủi lên không đúng định dạng";

      if (err.message.includes("Int") && err.message.includes("String")) {
         message = "ID phải là số nguyên, không được gửi dưới dạng chuỗi"; // vd: "id": 10 thay vì "id": "10"
      } else if (
         err.message.includes("Expected") &&
         err.message.includes("provided")
      ) {
         message =
            "Kiểu dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường ID";
      }

      return res
         .status(statusCodes.BAD_REQUEST)
         .json(responseError(message, statusCodes.BAD_REQUEST));
   }

   // 3. Trả về response lỗi thống nhất
   const statusCode = err.statusCodes || statusCodes.INTERNAL_SERVER_ERROR;
   const message = err.message || "Lỗi máy chủ nội bộ";

   const response = responseError(
      message,
      statusCode,
      NODE_ENV === "development" ? err.stack : undefined
   );

   // res.status(response.statusCode).json(response);
   res.status(statusCode).json(response);
};
