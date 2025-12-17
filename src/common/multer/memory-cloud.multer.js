// Cài thư viện: npm i multer
import multer from "multer";

const storage = multer.memoryStorage();
export const uploadMemoryCloud = multer({ storage: storage });
