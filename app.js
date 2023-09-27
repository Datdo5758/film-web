const path = require("path");
const express = require("express");
const cors = require("cors"); // Import thư viện cors
const bodyParser = require("body-parser");
const app = express();
const trendingMovieRoutes = require("./routes/movie");
const auth = require("./controllers/authMiddleware");
app.use(bodyParser.json());
app.use(cors());
// Sử dụng Middleware xác thực trước các Route cần xác thực
app.use(auth);
// Sử dụng các Router trong file routes/movie.js
app.use(trendingMovieRoutes);
app.use((req, res, next) => {
  res.status(404).json({
    err: "Route not found",
  });
});
app.listen(8000);
