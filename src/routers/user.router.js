import express from "express";
import { userController } from "../controllers/user.controller.js";
import protect from "../common/middleware/protect.middleware.js";
import { uploadLocalDisk } from "../common/multer/local-disk.multer.js";
import { uploadMemoryCloud } from "../common/multer/memory-cloud.multer.js";
import { adminProtect } from "../common/middleware/adminProtect.middleware.js";

const userRouter = express.Router();

// Upload hình ảnh ở Local disk
userRouter.post(
   "/avatar-local",
   protect,
   uploadLocalDisk.single("avatar"), // cài npm i multer
   userController.avatarLocal
);

// Upload hình ảnh lên cloud (lưu trữ đám mây)
userRouter.post(
   "/avatar-cloud",
   protect,
   uploadMemoryCloud.single("avatar"),
   userController.avatarCloud
);

// Tạo route CRUD
userRouter.post("/", userController.create);
userRouter.get("/", protect, adminProtect, userController.findAll);
userRouter.get("/:id", userController.findOne);

// Sửa thông tin người dùng
userRouter.patch("/:id", protect, userController.update);
// userRouter.delete("/:id", userController.remove);

export default userRouter;
