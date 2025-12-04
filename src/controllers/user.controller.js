import { responseSuccess } from "../common/helpers/function.helper.js";
import { userService } from "../services/user.service.js";

export const userController = {
   avatarLocal: async function (req, res, next) {
      const result = await userService.avatarLocal(req);
      const response = responseSuccess(result, `CONTROLLER: Avatar Local`);
      res.status(response.statusCode).json(response);
   },

   avatarCloud: async function (req, res, next) {
      const result = await userService.avatarCloud(req);
      const response = responseSuccess(result, `CONTROLLER: Avatar Cloud`);
      res.status(response.statusCode).json(response);
   },

   create: async function (req, res, next) {
      const result = await userService.create(req);
      const response = responseSuccess(result, `Create user successfully`);
      res.status(response.statusCode).json(response);
   },

   findAll: async function (req, res, next) {
      const result = await userService.findAll(req);
      const response = responseSuccess(result, `Find All user`);
      res.status(response.statusCode).json(response);
   },

   findOne: async function (req, res, next) {
      const result = await userService.findOne(req);
      const response = responseSuccess(result, `Find One user`);
      res.status(response.statusCode).json(response);
   },
};
