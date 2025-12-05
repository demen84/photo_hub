import express from "express";
import { authController } from "../controllers/auth.controller.js";
import protect from "../common/middleware/protect.middleware.js";
import passport from "passport";
import { registerRateLimiter } from "../common/middleware/rate-limit.middleware.js";
// import { checkPermision } from "../common/middleware/check-permision.middleware.js";

const authRouter = express.Router();

// Tạo route CRUD
authRouter.post(
   "/register",
   registerRateLimiter, // Đây là middleware: kiểm tra & chặn request nếu vượt quá 5 lần (5 request) trong vòng 10 phút
   authController.register
);
authRouter.post("/login", authController.login);

/**
 * !Route lấy thông tin user hiện tại (dựa vào token)
 * Route này cần bảo vệ, chỉ cho phép user đã đăng nhập (có token hợp lệ) mới được phép gọi
 * Nên dùng middleware protect để bảo vệ route này
 */
authRouter.get("/get-info", protect, authController.getInfo); // Bỏ checkPermision tại get-info vì quy mô dự án ko có phân quyền

// ! Login GOOGLE with OAUTH2.0
// Khi người dùng click nút google login, thì FE sẽ gọi tới GET: api/auth/google
// Kích hoạt passport để:
//    - yêu cầu lấy thông tin: profile, email
//    - tự chuyển FE sang trang đăng nhập với google
authRouter.get(
   "/google",
   passport.authenticate("google", { scope: ["profile", "email"] })
);

// Sau khi user xác thực với google thành công thì google sẽ chuyển user về API (thanh url = GET) này
// API này để hứng tín hiệu của google chuyển user, kích hoạt Middleware passport để passport là việc với google lấy profile nằm trong hàm verify (đó là tham số thứ 2 của Strategy bên file google-oauth20-passport.js).
authRouter.get(
   "/google/callback",
   passport.authenticate("google", {
      failureRedirect: "/login",
      session: false,
   }), // Middleware: nếu đăng nhập thất bại thì chuyển về /login
   authController.googleCallback
);

// ! Yêu cầu FE gửi xuống BE 2 cái: 1-accessToken đã hết hạn; 2-refreshToken mà BE cung cấp lúc user login.
authRouter.post("/refresh-token", authController.refreshToken);

export default authRouter;
