export const authSwagger = {
   "/auth/register": {
      post: {
         tags: ["Authorized"],
         summary: "Trả về trạng thái đăng ký (boolean).",

         requestBody: {
            description: "Mô tả tùy chọn trong *Markdown*",
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     properties: {
                        email: {
                           type: "string",
                           example: "new-email@yahoo.com",
                        },
                        password: {
                           type: "string",
                           example: "new-password@123",
                        },
                        fullName: {
                           type: "string",
                           example: "Phan Văn Cậy",
                        },
                     },
                  },
               },
            },
         },

         description: "Ghi chú gì đó tại đây.",
         responses: {
            200: {
               description: "Mảng JSON chứa thông tin đăng nhập",
            },
         },
      },
   },
   "/auth/login": {
      post: {
         tags: ["Authorized"],
         summary: "Trả về trạng thái đăng nhập (boolean).",

         requestBody: {
            description: "Mô tả tùy chọn trong *Markdown*",
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     properties: {
                        email: {
                           type: "string",
                           example: "quy@yahoo.com",
                        },
                        password: {
                           type: "string",
                           example: "quy@123",
                        },
                     },
                  },
               },
            },
         },

         description: "Ghi chú gì đó tại đây.",
         responses: {
            200: {
               description: "Mảng JSON chứa thông tin đăng nhập",
            },
         },
      },
   },
   "/auth/get-info": {
      get: {
         tags: ["Authorized"],

         security: [
            {
               BearerAuth: [],
            },
         ],

         summary: "Trả về thông tin user.",
         description: "Ghi chú gì đó tại đây.",
         responses: {
            200: {
               description: "Mảng JSON chứa thông tin đăng nhập",
            },
         },
      },
   },
};
