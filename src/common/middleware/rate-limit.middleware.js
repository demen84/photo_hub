/**
 * Cài thư viện: npm i express-rate-limit
 * Tạo middleware rate-limit.middleware.js
 * Đưa middleware này vào giữa router register ở auth.router.js
 * authRouter.post("/register", registerRateLimiter, authController.register
 );
 */
import rateLimit from "express-rate-limit";
import { ManyRequestException } from "../helpers/exception.helper.js";
const MESSAGE =
   "Bạn đã thực hiện quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau 10 phút.";

// Ví dụ: tối đa 5 lần đăng ký trong 10 phút trên mỗi IP
export const registerRateLimiter = rateLimit({
   windowMs: 10 * 60 * 1000, // 10 phút
   max: 5, // mỗi IP được 5 request trong window
   standardHeaders: true, // gửi RateLimit-* headers
   legacyHeaders: false, // tắt X-RateLimit-* legacy headers
   handler: (req, res, next) => {
      next(new ManyRequestException(MESSAGE));
   },
});
