// Step 7: tạo các function dùng chung tại đây
export const responseSuccess = (
   queryData,
   thongBao = "OK",
   maTrangThai = 200
) => {
   return {
      status: "susccess",
      statusCode: maTrangThai,
      message: thongBao,
      data: queryData,
      docs: "swagger",
   };
};

export const responseError = (
   thongBao = "Internal Server Error",
   maTrangThai = 500,
   stack
) => {
   return {
      status: "error",
      statusCode: maTrangThai,
      message: thongBao,
      stack: stack, // Lưu lại dấu vết lỗi
   };
};
