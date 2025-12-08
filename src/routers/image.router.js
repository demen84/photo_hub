import express from "express";
import { imageController } from "../controllers/image.controller.js";
import protect from "../common/middleware/protect.middleware.js";

const imageRouter = express.Router();

// Tạo route CRUD
// imageRouter.post("/", imageController.create);

imageRouter.get("/", protect, imageController.getImageList);

imageRouter.get("/search", imageController.timTheoTenHinh); // ! để cái này sau findOne là sẽ bị lỗi 500 do bị conflict với fidnOne

imageRouter.get(
   "/get-image-and-nguoi-tao/:id",
   protect,
   imageController.getImageByHinh_id
);

imageRouter.get("/get-comment/:hinh_id", imageController.getCommentByHinh_Id);

imageRouter.get(
   "/check-save-image/:hinh_id",
   protect,
   imageController.checkSaveImage
);

imageRouter.post("/save-comment", protect, imageController.saveComment);

export default imageRouter;
