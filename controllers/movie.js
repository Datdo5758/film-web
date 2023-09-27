const Movies = require("../models/Movie");
const Genres = require("../models/Genre");
const Videos = require("../models/Video");
const allMovies = Movies.all();
const allGenres = Genres.all();
const allVideos = Videos.all();

// controller: hàm lấy dữ liệu phim trending
exports.getTrendingMovies = (req, res, next) => {
  const page = req.params.page ? req.params.page : 1;

  const itemsPerPage = 20;

  // Sắp xếp các film theo trường popularity giảm dần
  const trendingMovies = allMovies.sort((a, b) => b.popularity - a.popularity);

  // Tính chỉ số bắt đầu và chỉ số kết thúc cho từng page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, trendingMovies.length);

  // Lấy danh sách phim cho page hiện tại
  const currentPageMovies = trendingMovies.slice(startIndex, endIndex);

  const total_pages = Math.ceil(trendingMovies.length / itemsPerPage);

  res.status(200).json({
    results: currentPageMovies,
    page: page,
    total_pages: total_pages,
  });
};

// controller: hàm lấy dữ liệu phim toprate
exports.getToprateMovies = (req, res, next) => {
  const page = req.params.page ? req.params.page : 1;

  const itemsPerPage = 20;

  // Sắp xếp các film theo trường popularity giảm dần
  const toprateMovies = allMovies.sort(
    (a, b) => b.vote_average - a.vote_average
  );

  // Tính chỉ số bắt đầu và chỉ số kết thúc cho từng page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, toprateMovies.length);

  // Lấy danh sách phim cho page hiện tại
  const currentPageMovies = toprateMovies.slice(startIndex, endIndex);

  const total_pages = Math.ceil(toprateMovies.length / itemsPerPage);

  res.status(200).json({
    results: currentPageMovies,
    page: page,
    total_pages: total_pages,
  });
};

// controller: hàm lấy dữ liệu phim theo genre

exports.getGenreMovies = (req, res, next) => {
  const genre = req.params.genre;

  const page = req.params.page ? req.params.page : 1;
  const itemsPerPage = 20;

  const genreItem = allGenres.find(item => item.name.toLowerCase() === genre);
  if (!genreItem) {
    res.status(400).json({ err: "Not found gerne parram" });
  }

  const genreMovies = allMovies.filter(item =>
    item.genre_ids.includes(genreItem.id)
  );
  if (!genreMovies) {
    res.status(400).json({ err: "Not found that gerne id" });
  }
  // Tính chỉ số bắt đầu và chỉ số kết thúc cho từng page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, genreMovies.length);

  // Lấy danh sách phim cho page hiện tại
  const currentPageMovies = genreMovies.slice(startIndex, endIndex);

  const total_pages = Math.ceil(genreMovies.length / itemsPerPage);

  res.status(200).json({
    results: currentPageMovies,
    page: page,
    total_pages: total_pages,
    genre_name: genre,
  });
};

// controller: hàm lấy trailer phim
exports.getVideo = (req, res, next) => {
  const movieId = req.params.movieId;

  const movie = allVideos.find(item => item.id == movieId);
  if (!movie) {
    res.status(400).json({ err: "Not found film_id parram" });
  }
  const video = movie.videos.filter(
    item =>
      item.official === true &&
      item.site === "YouTube" &&
      (item.type === "Trailer" || item.type === "Teaser")
  );
  if (!video) {
    res.status(404).json({ err: "Not found video" });
  }
  const result = video[0];
  res.status(200).json({
    result,
  });
};

// lấy danh sách phim theo search
exports.getSearchMovies = (req, res, next) => {
  const keyWord = req.params.keyword.toLowerCase().split("-");
  const resultObject = {};
  keyWord.forEach(str => {
    const keyValuePairs = str.split(":");
    const key = keyValuePairs[0];
    const value = keyValuePairs[1];
    resultObject[key] = value;
  });

  const page = req.params.page ? req.params.page : 1;
  const itemsPerPage = 20;
  let movies = allMovies.filter(
    item =>
      item.overview.toLowerCase().includes(keyWord[0]) ||
      (item.title
        ? item.title.toLowerCase().includes(keyWord[0])
        : item.name.toLowerCase().includes(keyWord[0]))
  );
  if (movies.length === 0) {
    res.status(400).json({
      err: "Not found keyword parram",
    });
  }
  // lọc phim theo genre
  const genreItem = allGenres.find(
    item => item.name.toLowerCase() === resultObject.genre
  );

  if (genreItem) {
    movies = movies.filter(item => item.genre_ids.includes(genreItem.id));
  }
  // lọc phim theo media
  if (resultObject.media) {
    if (resultObject.media === "all") {
      movies = movies;
    } else {
      movies = movies.filter(item =>
        item.media_type.includes(resultObject.media)
      );
    }
  }
  // lọc phim theo ngôn ngữ
  if (resultObject.language) {
    movies = movies.filter(item =>
      item.original_language.includes(resultObject.language)
    );
  }
  // lọc phim theo năm
  if (resultObject.year) {
    movies = movies.filter(item =>
      (item.release_date ? item.release_date : item.first_air_date).includes(
        resultObject.year
      )
    );
  }

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, movies.length);

  // Lấy danh sách phim cho page hiện tại
  const results =
    movies.length > 20 ? movies.slice(startIndex, endIndex) : movies;

  res.status(200).json({
    results,
  });
};
