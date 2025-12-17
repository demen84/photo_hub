// Cài thư viện: npm i multer
import multer from "multer";

// Code này lấy tứ npmjs.com -> multer
const storage = multer.memoryStorage();
export const uploadMemoryCloud = multer({ storage: storage });
