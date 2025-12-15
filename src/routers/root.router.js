import express from "express";
import authRouter from "./auth.router.js";
import userRouter from "./user.router.js";
import imageRouter from "./image.router.js";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "../common/swagger/init.swagger.js";

// Step 1:
const rootRouter = express.Router();

/**
 * Xử lý Swagger: https://www.npmjs.com/package/swagger-ui-express
 * https://swagger.io/docs/specification/v3_0/about/
 * const swaggerDocument = require('./swagger.json');
 * swaggerDocument: chấp nhận 3 kiểu: yaml | yml, javascript, json
 * http://localhost:3069/api/docs
 */
rootRouter.use(
   "/docs",
   swaggerUi.serve,
   swaggerUi.setup(swaggerDocument, {
      swaggerOptions: { persistAuthorization: true }, // Giữ trạng thái (lưu accessToken) trong ổ khóa chỗ Authorized
   })
);

// Step 2:
rootRouter.use("/auth", authRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/image", imageRouter);

export default rootRouter;
