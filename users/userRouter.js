const express = require('express');
const userDb = require('./userDb');
const postDb = require('../posts/postDb')
const router = express.Router();
router.use(express.json());

router.post('/', (req, res) => {
  const postData = req.body;
  console.log(postData);
  const { id, text } = postData
  userDb.getUserPosts(id)
    .then(postData => {
      if (!id || !text) {
        res
          .status(400)
          .json({ errorMessage: 'Please provide REQUIRED contents for the post.' })
      } else {
        postData.insert(postData)
          .then(post => {
            res
              .status(201)
              .json(post);
          })
          .catch(error => {
            console.log('error on POST users/posts', error);
            res
              .status(500)
              .json({ error: 'There was an error while saving the post to the database.' })
          });
      };
    });

  router.post('/:id/posts', (req, res) => {
    const id = req.params.id;
    const postData = req.body;
    const { text } = postData
    console.log('users/post/: id', id);

    userDb.getUserPosts(id)
      .then(post => {
        console.log('post', post)
        console.log('post test', text)
        if (!post) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." })
        } else if (!text) {
          res
            .status(400)
            .json({ errorMessage: "Please provide text for the post." })
        } else {
          console.log('post body', postData)
          postDb.insert(postData)
            .then(comment => {
              res
                .status(200)
                .json(comment)
            })
            .catch(error => {
              console.log('error on POST /:id/posts', error);
              res
                .status(500)
                .json({ error: "There was an error while saving the post to the database" });
            });
        }
      });
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
    userDb.getById(req.params.id)
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res
            .status(404)
            .json({ message: 'The user with the specified ID does not exist.' });
        }
      })
      .catch(error => {
        console.log('error on GET /user/:id', error);
        res
          .status(500)
          .json({
            message: 'The user information could not be retrieved.',
          });
      });
  });

  router.get('/:id/posts', (req, res) => {
    // do your magic!
  });

  router.delete('/:id', (req, res) => {
    const id = req.params.id;
    userDb.getById(id)
      .then(user => {
        if (!user) {
          res
            .status(404)
            .json({ message: "The user with the specified ID does not exist." })
        } else {
          userDb.remove(id)
            .then(user => {
              res
                .status(201)
                .json(user)
            })
            .catch(error => {
              console.log('error on DELETE /users/:id', error);
              res
                .status(500)
                .json({ error: "The user could not be removed." });
            });
        };
      });
  });

  router.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body
    console.log(req.body)

    userDb.getById(id)
      .then(user => {
        console.log('user', user)
        if (!user) {
          res
            .status(404)
            .json({ message: "The user with the specified ID does not exist." })
        } else if (!changes.name) {
          res
            .status(400)
            .json({ errorMessage: "Please provide NAME for the user." })
        } else {
          userDb.update(id, changes)
            .then(user => {
              res
                .status(200)
                .json(user)
            })
            .catch(error => {
              console.log('error on PUT /users/:id', error);
              res
                .status(500)
                .json({ error: "The user information could not be modified." });
            });
        }
      });
  });

  //custom middleware

  function validateUserId(req, res, next) {
    const id = req.body;
    console.log('valid id', id)
    if (id && id === id) {
      next();
    } else {
      res.status(401).json({ message: "invalid user id" });
    }
  }

  function validateUser(req, res, next) {
    // do your magic!
  }

  function validatePost(req, res, next) {
    // do your magic!
  }

  module.exports = router;
