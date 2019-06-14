var express = require( "express" );
var logger = require( "morgan" );
var mongoose = require( "mongoose" );

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require( "axios" );
var cheerio = require( "cheerio" );

// Require all models
var db = require( "./models" );

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use( logger( "dev" ) );
// Parse request body as JSON
app.use( express.urlencoded( { extended: true } ) );
app.use( express.json() );
// Make public a static folder
app.use( express.static( "public" ) );

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/thtDB";
mongoose.connect( MONGODB_URI, { useNewUrlParser: true } );

// ! Old Routes

// // Route for getting all Reviews from the db
// app.get( "/reviews", function ( req, res ) {
//   db.Review.find( {} )
//     .then( dbReviews => res.json( dbReviews ) )
//     .catch( err => res.json( err ) );
// } );

// // Route for grabbing a specific Review by id, populate it with it's Comment
// app.get( "/reviews/:id", function ( req, res ) {
//   db.Review.findOne( { _id: req.params.id } )
//     .populate( "comment" )
//     .then( dbReview => res.json( dbReview ) )
//     .catch( err => res.json( err ) );
// } );

// // Route for saving/updating an Review's associated Comment
// app.post( "/reviews/:id", function ( req, res ) {
//   db.Comment.create( req.body )
//     .then( dbComment => db.Review.findOneAndUpdate( { _id: req.params.id },
//       { $push: { comment: dbComment._id } }, { new: true } ) );
// } );

// * Define API Routes
app.use( '/api/scrape', require( './routes/api/scrape' ) );
app.use( '/api/users', require( './routes/api/users' ) );
app.use( '/api/auth', require( './routes/api/auth' ) );
app.use( '/api/profile', require( './routes/api/profile' ) );
app.use( '/api/products', require( './routes/api/products' ) );
app.use( '/api/messages', require( './routes/api/messages' ) );

// * Start Server
app.listen( PORT, () => console.log( `Server started on port http://localhost/${ PORT }` ) );