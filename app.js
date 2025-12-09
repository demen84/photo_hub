import express from "express";
import cors from "cors";
import rootRouter from "./src/routers/root.router.js";
import { appError } from "./src/common/app-error/app.error.js";
import { NODE_ENV, PORT } from "./src/common/constant/app.constant.js";

const app = express();

app.use(express.json()); // Parse JSON

// Config CORS:
app.use(
   cors({
      origin: [
         "http://localhost:3000",
         "http://localhost:3001",
         "http://localhost:3168",
         "https://google.com",
         "https://yahoo.com",
      ],
   })
);

// API test to check connect
app.get("/check", (req, res) => {
   const data = req.body;
   // console.log({ data });

   res.json({
      title: "Bài tập Capstone - Buổi 5 - Photo-Hub",
      message: "Kiểm tra kết nối thành công",
      data: data,
   });
});

// const PORT = 3434;
const domain = `http://localhost:${PORT}`;

// Step 3:
app.use("/api", rootRouter);

/**
 * Middleware xử lý lỗi toàn cục
 * Middleware này phải nằm sau Step 3: app.use("/api", rootRouter);
 */
app.use(appError); // Đặt dòng này sau rooteRouter => để bắt hết lỗi

// app.listen(PORT, () => console.log(`Server online at ${domain}`));
app.listen(PORT, () => {
   console.log(`Server is running at: http://localhost:${PORT}`);
   console.log(`Environment: ${process.env.NODE_ENV || NODE_ENV}`);
   console.log(`API docs: http://localhost:${PORT}/api`);
});

/**
 * ! NOTE FOR GIT HUB command:
 * Chuyển từ nhánh master sang nhánh main:
 * git checkout master
 * git branch -m main
 * or: viết gọn trong 1 dòng (từ Git 2.23 trở lên):
 * git switch master          # hoặc git checkout master
 * git branch -m master main  # rõ ràng hơn, tránh nhầm
 * Or gọn hơn nữa: git branch -m master main
 * Tiếp theo:
 * git init
 * git add .
 * git commit -m "up src"
 * git remote add origin https://github.com/demen84/photo_hub.git
 * git branch -M main    // đảm bảo nhánh local là main
 * git push -u origin main --force //Lần sau update src thì chỉ cần git push
 */
