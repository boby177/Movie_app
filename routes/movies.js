const router = require("express").Router();
const Movie = require("../models/movie");
const movies = require("../config/movies.json");

router.get("/movie", async (req, res) => {
  try {
    // Implement search, sort, filter and paginations methods
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    let sort = req.query.sort || "rating";
    let genre = req.query.genre || "All";

    const genreList = [
      "Action",
      "Romance",
      "Fantasy",
      "Drama",
      "Crime",
      "Adventure",
      "Thriller",
      "Sci-fi",
      "Music",
      "Family",
    ];

    genre === "All"
      ? (genre = [...genreList])
      : (genre = req.query.genre.split(","));
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }

    const movies = await Movie.find({ name: { $regex: search, $options: "i" } })
      .where("genre")
      .in([...genre])
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const total = await Movie.countDocuments({
      genre: { $in: [...genre] },
      name: { $regex: search, $options: "i" },
    });

    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      genres: genreList,
      movies,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
    console.log(error);
  }
});

// Insert data movie from movies.json
// const insertMovie = async () => {
//   try {
//     const docs = await Movie.insertMany(movies);
//     return Promise.resolve(docs);
//   } catch (error) {
//     return Promise.reject(error);
//   }
// };

// insertMovie()
//   .then((docs) => console.log(docs))
//   .catch((error) => console.log(error));

module.exports = router;
