const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

const db = require('../../models');

// * @route   GET api/scrape
// * @desc    Scrape route
// * @access  Public
router.get('/', async (req, res) => {
  const response = await axios.get(
    'https://pitchfork.com/reviews/best/albums/'
  );
  const $ = cheerio.load(response.data);

  $('.review').each(function(i, element) {
    let result = {};

    result.artist = $(this)
      .find('.artist-list > li')
      .text();
    result.title = $(this)
      .find('.review__title-album')
      .text();
    result.link =
      'https://pitchfork.com/' +
      $(this)
        .find('.review__link')
        .attr('href');
    result.image = $(this)
      .find('.review__artwork > div > img')
      .attr('src');

    db.Review.create(result)
      .then(function(dbReview) {
        console.log(dbReview);
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  return res.redirect('/');
});

router.get('/delete', async (req, res) => {
  try {
    await db.Review.collection.drop();
    return res.redirect('/');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
