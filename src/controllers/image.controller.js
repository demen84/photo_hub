import { responseSuccess } from "../common/helpers/function.helper.js";
import { imageService } from "../services/image.service.js";

export const imageController = {
   getImageList: async (req, res, next) => {
      const result = await imageService.getImageList(req);
      const response = responseSuccess(
         result,
         `At Controller: Get all images successfully`
      );
      res.status(response.statusCode).json(response);
   },

   // findOne: async (req, res, next) => {
   //    const result = await imageService.findOne(req);
   //    const response = responseSuccess(
   //       result,
   //       `Get image #${req.params.id} successfully`
   //    );
   //    res.status(response.statusCode).json(response);
   // },

   timTheoTenHinh: async (req, res, next) => {
      const result = await imageService.timTheoTenHinh(req);
      const response = responseSuccess(result.data, result.message);
      res.status(response.statusCode).json(response);
   },

   getImageByHinh_id: async (req, res, next) => {
      const result = await imageService.getImageByHinh_id(req);
      const response = responseSuccess(
         result,
         `Lấy danh sách hình ảnh & người tạo ảnh bằng id ảnh.`
      );
      res.status(response.statusCode).json(response);
   },

   getCommentByHinh_Id: async (req, res, next) => {
      const result = await imageService.getCommentByHinh_Id(req);
      const response = responseSuccess(
         result,
         `Lấy thông tin bình luận theo id ảnh`
      );
      res.status(response.statusCode).json(response);
   },

   checkSaveImage: async (req, res, next) => {
      const result = await imageService.checkSaveImage(req);
      const response = responseSuccess(
         result,
         `Kiểm tra trạng thái lưu ảnh thành công`
      );
      res.status(response.statusCode).json(response);
   },

   saveComment: async (req, res, next) => {
      const result = await imageService.saveComment(req);
      const response = responseSuccess(
         result,
         `Lưu thông tin bình luận thành công`
      );
      res.status(response.statusCode).json(response);
   },
};
