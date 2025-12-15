export const authSwagger = {
   "/auth/register": {
      post: {
         tags: ["Authorized"],
         summary: "Đăng ký người dùng (trả về trạng thái boolean).",
         description: "Đăng ký người dùng mới.",

         requestBody: {
            description: "Thông tin đăng ký người dùng mới",
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     properties: {
                        email: {
                           type: "string",
                           description: "Email của người dùng",
                           example: "email@yahoo.com",
                        },
                        mat_khau: {
                           type: "string",
                           description: "Mật khẩu người dùng",
                           example: "Passw0rd@123",
                        },
                        ho_ten: {
                           type: "string",
                           description: "Họ tên người dùng",
                           example: "Phan Trường Xuân",
                        },
                        tuoi: {
                           type: "string",
                           description: "Tuổi người dùng",
                           example: 21,
                        },
                     },
                  },
                  example: {
                     email: "email@yahoo.com",
                     mat_khau: "Xung@123",
                     ho_ten: "Phan Trường Xuân",
                     tuoi: 21,
                  },
               },
            },
         },

         responses: {
            200: {
               description: "Đăng ký người dùng mới thành công.",
            },
         },
      },
   },
   "/auth/login": {
      post: {
         tags: ["Authorized"],
         summary: "Trả về trạng thái đăng nhập (boolean).",
         description: "Người dùng đăng nhập.",

         requestBody: {
            description: "Đăng nhập vào hệ thống",
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     properties: {
                        email: {
                           type: "string",
                           description: "Email người dùng.",
                           example: "hoang@gmail.com",
                        },
                        mat_khau: {
                           type: "string",
                           description: "Mật khẩu người dùng.",
                           example: "Apple@123",
                        },
                     },
                  },
                  example: {
                     email: "hoang@gmail.com",
                     mat_khau: "Apple@123",
                  },
               },
            },
         },

         responses: {
            200: {
               description: "Đăng nhập thành công",
            },
         },
      },
   },
   "/auth/get-info": {
      get: {
         tags: ["Authorized"],

         // Show lock symbol, Bảo mật bằng Bearer Token
         security: [
            {
               BearerAuth: [],
            },
         ],

         summary: "Trả về thông tin người dùng.",
         description: "Thông tin người dùng.",
         responses: {
            200: {
               description: "Lấy thông tin người dùng thành công",
            },
         },
      },
   },
};
