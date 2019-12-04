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
  postDb.getById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch(error => {
      console.log('error on GET /posts/:id', error);
      res
        .status(500)
        .json({
          message: 'The post information could not be retrieved.',
        });
    });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  postDb.getById(id)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." })
      } else {
        postDb.remove(id)
          .then(post => {
            res
              .status(201)
              .json(post)
          })
          .catch(error => {
            console.log('error on DELETE /posts/:id', error);
            res
              .status(500)
              .json({ error: "The post could not be removed." });
          });
      };
    });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const changes = req.body
  console.log(req.body)

  postDb.getById(id)
    .then(post => {
      console.log('post', post)
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." })
      } else if (!changes.text) {
        res
          .status(400)
          .json({ errorMessage: "Please provide TEXT for the post." })
      } else {
        postDb.update(id, changes)
          .then(post => {
            res
              .status(200)
              .json(post)
          })
          .catch(error => {
            console.log('error on PUT /posts/:id', error);
            res
              .status(500)
              .json({ error: "The post information could not be modified." });
          });
      }
    });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;
