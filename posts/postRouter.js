const express = require('express');
const postDb = require('./postDb');
const router = express.Router();
router.use(express.json());

router.get('/', (req, res) => {
  postDb.get()
    .then(post => {
      res
        .status(200)
        .json(post);
    })
    .catch(error => {
      console.log('error on GET /posts', error);
      res
        .status(500)
        .json({ errorMessage: 'The posts information could not be retrieved.' });
    });
});

router.get('/:id', (req, res) => {
  // do your magic!
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;
