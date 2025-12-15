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
            description: "Lưu hình ở Local disk",
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

         description: "Lưu hình avatar tại local disk.",
         responses: {
            200: {
               description: "Lưu hình avatar ở local disk thành công",
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

         description: "Upload avatar lên cloud.",
         responses: {
            200: {
               description: "Update avatar lên cloud thành công",
            },
         },
      },
   },

   "/user": {
      get: {
         tags: ["Users"],
         summary: "Danh sách người dùng.",

         // Show ổ khóa ngay api user/avatar-local
         security: [
            {
               BearerAuth: [],
            },
         ],

         parameters: [
            {
               in: "query",
               name: "page",
               description: "Page index",
            },
            {
               in: "query",
               name: "pageSize",
               description: "Page size index",
            },
         ],

         // requestBody: {
         //    description: "Mô tả tùy chọn trong *Markdown*",
         //    required: true,
         //    content: {
         //       "multipart/form-data": {
         //          schema: {
         //             type: "object",
         //             properties: {
         //                avatar: {
         //                   type: "string",
         //                   format: "binary",
         //                },
         //                avatars: {
         //                   type: "array",
         //                   items: {
         //                      type: "string",
         //                      format: "binary",
         //                   },
         //                },
         //             },
         //          },
         //       },
         //    },
         // },

         description: "Lấy danh sách người dùng.",
         responses: {
            200: {
               description: "Lấy danh sách người dùng thành công",
            },
         },
      },
   },

   "/user/{id}": {
      patch: {
         tags: ["Users"],
         summary: "Cập nhật thông tin người dùng (partial update)",
         description:
            "Cập nhật một phần hoặc toàn bộ thông tin người dùng theo ID người dùng (nguoi_dung_id).",

         // Show ổ khóa ngay api user/avatar-local
         // Bảo mật bằng Bearer token
         security: [
            {
               BearerAuth: [],
            },
         ],

         // Định nghĩa path parameter {id}
         parameters: [
            {
               name: "id",
               in: "path",
               required: true,
               description: "Nhập ID của người dùng cần cập nhật:",
               schema: {
                  type: "integer",
               },
            },
         ],

         // Dữ liệu cập nhật gửi trong body (JSON)
         requestBody: {
            description:
               "Thông tin người dùng cần cập nhật (chỉ gửi các trường muốn thay đổi):",
            required: true,
            content: {
               "application/json": {
                  schema: {
                     type: "object",
                     properties: {
                        ho_ten: {
                           type: "string",
                           description: "Họ tên người dùng",
                           example: "Trần Huy Hoàng",
                        },
                        tuoi: {
                           type: "integer",
                           description: "Tuổi người dùng",
                           example: 20,
                        },
                        anh_dai_dien: {
                           type: "string",
                           description: "Đường dẫn ảnh đại diện",
                           example: "/hinhavatar.jpg",
                        },
                     },
                  },
                  // example: {
                  //    ho_ten: "Nguyễn Văn A",
                  //    tuoi: 25,
                  //    anh_dai_dien: "images/hinhanh.jpg",
                  // },
                  examples: {
                     "Chỉ cập nhật tên": {
                        value: { ho_ten: "Trần Huy Hoàng" },
                     },
                     "Chỉ cập nhật tuổi": {
                        value: { tuoi: 20 },
                     },
                     "Cập nhật ảnh đại diện": {
                        value: { anh_dai_dien: "/hinhavatar.jpg" },
                     },
                     "Cập nhật tất cả (họ tên, tuổi & hình avatar)": {
                        value: {
                           ho_ten: "Lê Văn D",
                           tuoi: 28,
                           anh_dai_dien: "/hinhavatar.jpg",
                        },
                     },
                  },
               },
            },
         },

         responses: {
            200: {
               description: "Thông tin người dùng đã được cập nhật thành công",
               content: {
                  "application/json": {
                     schema: {
                        type: "object",
                        properties: {
                           id: { type: "integer" },
                           ho_ten: { type: "string" },
                           tuoi: { type: "integer" },
                           anh_dai_dien: { type: "string" },
                        },
                     },
                  },
               },
            },
            400: {
               description: "Dữ liệu gửi lên không hợp lệ",
            },
            401: {
               description: "Chưa xác thực (thiếu hoặc sai token)",
            },
            404: {
               description: "Không tìm thấy người dùng với ID này",
            },
         },
      },
   },
};
