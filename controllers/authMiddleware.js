const tokens = require("../models/UserToken");

// Hàm này kiểm tra xem người dùng đã đăng nhập hay chưa
function authenticateUser(req, res, next) {
  // Thực hiện xác thực người dùng ở đây (ví dụ: kiểm tra JWT token, cookie, session, v.v.)
  const allToken = tokens.all();
  // giả sử nhận được token:
  const userToken = "8qlOkxz4wq";
  const item = allToken.filter(item => item.token === userToken);

  if (item.length > 0) {
    // Nếu người dùng đã xác thực thành công, gọi hàm next() để tiếp tục xử lý
    next();
  } else {
    // Nếu người dùng chưa xác thực, trả về lỗi (status code 401: Unauthorized)
    res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = authenticateUser;
