const express = require('express');
const userDb = require('./userDb');
const router = express.Router();
router.use(express.json());

router.post('/', (req, res) => {
  // do your magic!
});

router.post('/:id/posts', (req, res) => {
  // do your magic!
});

router.get('/', (req, res) => {
  userDb.get()
    .then(user => {
      res
        .status(200)
        .json(user);
    })
    .catch(error => {
      console.log('error on GET /users', error);
      res
        .status(500)
        .json({ errorMessage: 'The user information could not be retrieved.' });
    });
});

router.get('/:id', (req, res) => {
  // do your magic!
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
