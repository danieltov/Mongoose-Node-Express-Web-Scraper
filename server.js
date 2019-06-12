var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/thtDB";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://pitchfork.com/reviews/best/albums/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an$() Review tag, and do the following:
    $(".review").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.artist = $(this)
        .find('.review__title > ul > li').text();
      result.title = $(this).find('.review__title-album').text();
      result.link = $(this)
        .find('.review__link').attr('href');

      // Create a new Review using the `result` object built from scraping
      db.Review.create(result)
        .then(function (dbReview) {
          // View the added result in the console
          console.log(dbReview);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Reviews from the db
app.get("/reviews", function (req, res) {
  db.Review.find({})
    .then(dbReviews => res.json(dbReviews))
    .catch(err => res.json(err));
});

// Route for grabbing a specific Review by id, populate it with it's Comment
app.get("/reviews/:id", function (req, res) {
  db.Review.findOne({ _id: req.params.id })
    .populate("Comment")
    .then(dbReview => res.json(dbReview))
    .catch(err => res.json(err));
});

// Route for saving/updating an Review's associated Comment
app.post("/reviews/:id", function (req, res) {
  db.Comment.create(req.body)
    .then(dbComment => db.Review.findOneAndUpdate({},
      { $push: { Comment: dbComment._id } }, { new: true }));
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
})