// Link: https://swagger.io/docs/specification/v3_0/about/

import { imageSwagger } from "./image.swagger.js";
import { authSwagger } from "./auth.swagger.js";
import { userSwagger } from "./user.swagger.js";

export const swaggerDocument = {
   openapi: "3.0.4",
   info: {
      title: "PhotoHub API",
      description: "Chào mừng bạn đến với PhotoHub API swagger.",
      version: "Phiên bản: 0.1.9",
   },
   servers: [
      {
         url: "http://localhost:3434/api",
         description: "Dev",
      },
      {
         url: "https://jaccs.com.vn/api",
         description: "Prod",
      },
   ],

   // Tạo ra biểu tượng cái khóa có chữ Authorize
   components: {
      securitySchemes: {
         BearerAuth: {
            type: "http",
            scheme: "bearer",
         },
      },
   },

   paths: {
      ...authSwagger,
      ...userSwagger,
      ...imageSwagger,
   },
};
