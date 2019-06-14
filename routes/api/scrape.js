const express = require( 'express' );
const router = express.Router();

// * @route   GET api/auth
// * @desc    Test route
// * @access  Public
router.get( '/', async ( req, res ) => {

  // First, we grab the body of the html with axios
  axios.get( "https://pitchfork.com/reviews/best/albums/" ).then( function ( response ) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load( response.data );

    // Now, we grab every h2 within an$() Review tag, and do the following:
    $( ".review" ).each( function ( i, element ) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.artist = $( this )
        .find( '.review__title > ul > li' ).text();
      result.title = $( this ).find( '.review__title-album' ).text();
      result.link = $( this )
        .find( '.review__link' ).attr( 'href' );

      // Create a new Review using the `result` object built from scraping
      db.Review.create( result )
        .then( function ( dbReview ) {
          // View the added result in the console
          console.log( dbReview );
        } )
        .catch( function ( err ) {
          // If an error occurred, log it
          console.log( err );
        } );
    } );

    // Send a message to the client
    res.send( "Scrape Complete" );
  } );

} );

module.exports = router;