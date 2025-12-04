export const userSwagger = {
   "/user/avatar-local": {
      post: {
         tags: ["Users"],
         summary: "Trả về trạng thái update avatar ở Local Disk.",

         // Show ổ khóa ngay api user/avatar-local
         security: [
            {
               BearerAuth: [],
            },
         ],

         requestBody: {
            description: "Mô tả tùy chọn trong *Markdown*",
            required: true,
            content: {
               "multipart/form-data": {
                  schema: {
                     type: "object",
                     properties: {
                        avatar: {
                           type: "string",
                           format: "binary",
                        },
                        avatars: {
                           type: "array",
                           items: {
                              type: "string",
                              format: "binary",
                           },
                        },
                     },
                  },
               },
            },
         },

         description: "Ghi chú gì đó tại đây.",
         responses: {
            200: {
               description: "Mảng JSON chứa thông tin avatar",
            },
         },
      },
   },

   "/user/avatar-cloud": {
      post: {
         tags: ["Users"],
         summary: "Trả về trạng thái update avatar lên cloud.",

         // Show ổ khóa ngay api user/avatar-local
         security: [
            {
               BearerAuth: [],
            },
         ],

         requestBody: {
            description: "Mô tả tùy chọn trong *Markdown*",
            required: true,
            content: {
               "multipart/form-data": {
                  schema: {
                     type: "object",
                     properties: {
                        avatar: {
                           type: "string",
                           format: "binary",
                        },
                        avatars: {
                           type: "array",
                           items: {
                              type: "string",
                              format: "binary",
                           },
                        },
                     },
                  },
               },
            },
         },

         description: "Ghi chú gì đó tại đây.",
         responses: {
            200: {
               description: "Mảng JSON chứa thông tin avatar",
            },
         },
      },
   },
};
