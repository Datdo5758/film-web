const express = require("express");

const router = express.Router();
const Movies = require("../controllers/movie");
// tạo các router lấy dữ liệu
router.get("/api/movies/trending/:page", Movies.getTrendingMovies);
router.get("/api/movies/top-rate/:page", Movies.getToprateMovies);
router.get("/api/movies/genre/:genre/:page", Movies.getGenreMovies);
router.get("/api/movies/video/:movieId", Movies.getVideo);
router.get("/api/movies/search/:keyword/:page", Movies.getSearchMovies);
module.exports = router;
