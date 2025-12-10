import express from "express";
import { imageController } from "../controllers/image.controller.js";
import protect from "../common/middleware/protect.middleware.js";

const imageRouter = express.Router();

// Tạo route CRUD
imageRouter.post("/upload", protect, imageController.create);
imageRouter.delete("/:hinh_id", protect, imageController.delete);

imageRouter.get("/", protect, imageController.getImageList);

imageRouter.get("/search", imageController.timTheoTenHinh); // ! để cái này sau findOne là sẽ bị lỗi 500 do bị conflict với fidnOne

imageRouter.get(
   "/get-image-and-nguoi-tao/:hinh_id",
   protect,
   imageController.getImageByHinh_id
);

imageRouter.get("/get-comment/:hinh_id", imageController.getCommentByHinh_Id);

imageRouter.get(
   "/check-save-image/:hinh_id",
   protect,
   imageController.checkSaveImage
);

// Lấy danh sách ảnh đã tạo theo userId (nguoi_dung_id)
imageRouter.get(
   "/get-created/:nguoi_dung_id",
   protect,
   imageController.getCreateImageByUserId
);

// Lấy danh sách ảnh đã lưu theo userId (nguoi_dung_id)
imageRouter.get(
   "/get-saved/:nguoi_dung_id",
   protect,
   imageController.getSavedImageByUserId
);

// Lưu thông tin bình luận của người dùng
imageRouter.post("/save-comment", protect, imageController.saveComment);

export default imageRouter;
