// cài thư viện: npm i multer
import multer from "multer";
import path from "path"; // Dùng để lấy tên file, đuôi file

// Code này lấy từ npmjs.com -> multer
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "public/images");
   },
   filename: function (req, file, cb) {
      //Lấy ra đuôi file hình (vd: .jpg, .png, ...)
      const exNameFile = path.extname(file.originalname);

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

      //Trả về tên file hình ảnh (vd: hinh_avatar.jpg)
      cb(null, "local" + "-" + uniqueSuffix + exNameFile);
   },
});

export const uploadLocalDisk = multer({ storage: storage });
