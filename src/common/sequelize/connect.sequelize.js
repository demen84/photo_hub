// Step 6: Tạo folder common/sequelize
// Tạo file connect.sequelize.js

// Import Sequelize as here
// Các dòng code bên dưới copy từ website: https://sequelize.org/docs/v6/getting-started/
import { Sequelize } from "sequelize";
import { DATABASE_URL } from "../constant/app.constant.js";

// Option 1: Passing a connection URI
const sequelize = new Sequelize(DATABASE_URL, { logging: false }); // logging: false sẽ ko log dòng lệnh Tạo table trong console log

try {
    await sequelize.authenticate();
    console.log('Thiết lập kết nối thành công.');
} catch (error) {
    console.error('Không thể kết nối đến database:', error);
};

export default sequelize;
