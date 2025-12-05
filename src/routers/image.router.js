import express from "express";
import { imageController } from "../controllers/image.controller.js";
import protect from "../common/middleware/protect.middleware.js";

const imageRouter = express.Router();

// Tạo route CRUD
imageRouter.post("/", imageController.create);
imageRouter.get("/", protect, imageController.getImageList); // ! Có nên gắn Middleware protect chỗ này hay không? Nếu gắn thì bên postman phải qua tab Auth --> chọn Bearer Token tại Auth Type --> dán Token vào đây --> bấm Send --> OK
imageRouter.get("/search", imageController.timTheoTenHinh); // ! để cái này sau findOne là sẽ bị lỗi 500 do bị conflict với fidnOne

imageRouter.get("/:id", imageController.findOne);
imageRouter.patch("/:id", imageController.update);
imageRouter.delete("/:id", imageController.remove);

export default imageRouter;
