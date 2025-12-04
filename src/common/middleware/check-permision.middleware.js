import { BadRequestException } from "../helpers/exception.helper.js";
import prisma from "../prisma/connect.prisma.js";

// chức năng phân quyền này chỉ sử dụng được khi trước nó là middleware protect
// phải có protect ở trước để biết đc ai gọi API này
export const checkPermision = async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new BadRequestException(`Không có user ở Protect middleware`);
    }

    if (user.role === 1) { //1: ROLE_ADMIN
        next(); // next có nghĩa là chạy middleware tiếp theo, nhưng code vẫn chưa dừng, muốn kết thúc thì phải return như sau:
        return; // kết thúc hàm
    }

    const method = req.method;
    const endpoint = req.baseUrl + req.route?.path;

    // ví dụ
    // roleId: 2
    // permission: 1
    const rolePermission = await prisma.rolepermission.findFirst({
       where: {
          roleId: user.roleId,
          permissions: {
             method: method,
             endpoint: endpoint,
          },
          isActive: true, // isActive là 1 field trong bảng rolepermission trong db
       },
    });

    if (!rolePermission) {
        console.log("CHECK-PERMISSION:", {
            method: method,
            endpoint,
            roleId: user.roleId,
        });
        throw new BadRequestException("Người dùng không đủ quyền")
    }

    // console.log('Check permision', { user: user, method, endpoint });

    next();
};

// export default checkPermision;