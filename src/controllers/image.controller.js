import { responseSuccess } from "../common/helpers/function.helper.js";
import { imageService } from "../services/image.service.js";

export const imageController = {
   create: async (req, res, next) => {
      const result = await imageService.create(req);
      const response = responseSuccess(result, `Create image successfully`);
      res.status(response.statusCode).json(response);
   },

   getImageList: async (req, res, next) => {
      const result = await imageService.getImageList(req);
      const response = responseSuccess(
         result,
         `At Controller: Get all images successfully`
      );
      res.status(response.statusCode).json(response);
   },

   findOne: async (req, res, next) => {
      const result = await imageService.findOne(req);
      const response = responseSuccess(
         result,
         `Get image #${req.params.id} successfully`
      );
      res.status(response.statusCode).json(response);
   },

   timTheoTenHinh: async (req, res, next) => {
      const result = await imageService.timTheoTenHinh(req);
      const response = responseSuccess(result.data, result.message);
      res.status(response.statusCode).json(response);
   },

   update: async function (req, res, next) {
      const result = await imageService.update(req);
      const response = responseSuccess(
         result,
         `Update image #${req.params.id} successfully`
      );
      res.status(response.statusCode).json(response);
   },

   remove: async (req, res, next) => {
      const result = await imageService.remove(req);
      const response = responseSuccess(
         result,
         `Remove image #${req.params.id} successfully`
      );
      res.status(response.statusCode).json(response);
   },
};
