const express = require('express');
const router = express.Router();

const db = require('../../models');

// * @route   GET api/reviews
// * @desc    Get all reviews from db
// * @access  Public
router.get('/', async (req, res) => {
  try {
    const dbReviews = await db.Review.find({});
    return res.json(dbReviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route for grabbing a specific Review by id, populate it with it's Comment
router.get('/:id', async (req, res) => {
  try {
    const dbReview = await db.Review.findOne({ _id: req.params.id });
    return res.json(dbReview);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route for saving/updating an Review's associated Comment
router.post('/:id', async (req, res) => {
  try {
    await db.Review.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comments: req.body } },
      { new: true }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
