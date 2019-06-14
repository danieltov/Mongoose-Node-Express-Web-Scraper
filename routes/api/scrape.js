const express = require( 'express' );
const router = express.Router();
const axios = require( 'axios' );
const cheerio = require( "cheerio" );

// * @route   GET api/scrape
// * @desc    Scrape route
// * @access  Public
router.get( '/', async ( req, res ) => {

  // First, we grab the body of the html with axios
  const html = await axios.get( "https://pitchfork.com/reviews/best/albums/" );

  // Then, we load that into cheerio and save it to $ for a shorthand selector
  const $ = cheerio.load( html );

  // Now, we grab every h2 within an$() Review tag, and do the following:

  $( ".review" ).each( async ( i, element ) => {
    // Save an empty result object
    var result = {};

    // Add the text and href of every link, and save them as properties of the result object
    result.artist = $( this )
      .find( '.review__title > ul > li' ).text();
    result.title = $( this ).find( '.review__title-album' ).text();
    result.link = $( this )
      .find( '.review__link' ).attr( 'href' );

    // Create a new Review using the `result` object built from scraping

    try {
      const dbReview = await db.Review.create( result );
      console.log( dbReview );
    } catch ( err ) {
      console.error( err.message );
    }
  } );

  // Send a message to the client
  res.send( 'Scraped!' );
} );

module.exports = router;