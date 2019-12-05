const express = require('express');
const userDb = require('./userDb');
const postDb = require('../posts/postDb')
const router = express.Router();
router.use(express.json());

router.post('/',
  validateUser,
  (req, res) => {
    const user = req.body;
    const { name } = user;
    console.log(name);
    if (name.length === 0) {
      res
        .status(400)
        .json({ errorMessage: 'Please provide NAME for the user.' })
    } else {
      userDb.insert(user)
        .then(users => {
          res
            .status(201)
            .json(users);
        })
        .catch(error => {
          console.log('error on POST users', error);
          res
            .status(500)
            .json({ error: 'There was an error while saving the user to the database.' })
        });
    };
  });

router.post('/:id/posts',
  validatePost,
  (req, res) => {
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

router.get('/:id/posts', validateUserId, (req, res) => {
  userDb.getUserPosts(req.params.id)
    .then(post => {
      if (post.length === 0) {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(error => {
      console.log('error on GET /:id/posts', error);
      res
        .status(500)
        .json({
          message: 'The post information could not be retrieved.',
        });
    });
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
  const id = req.params.id;
  console.log('valid id', id)
  userDb.getById(id)
    .then(user => {
      if (!user) {
        res.status(401).json({ message: "invalid user id" });
      } else {
        req.user = user
        next();
      }
    })
    .catch(error => {
      console.log('error on Validating /UserID', error);
      res
        .status(500)
        .json({ error: "Server Error Validating ID." });
    });
}

function validateUser(req, res, next) {
  // !req.body && res.status(400).json({ message: "User data required." });
  // !req.body.name && res.status(400).json({ message: "User name required." });
  // next();
  const user = req.body;
  console.log(user);
  const { name } = user;
  if (!name) {
    res
      .status(400)
      .json({ message: "User Name required." });
  }
  else if (!user) {
    res
      .status(400)
      .json({ message: "User data required." });
  } else {
    next();
  }


}



function validatePost(req, res, next) {
  // !req.body && res.status(400).json({ message: "Post data required." });
  // !req.body.text && res.status(400).json({ message: "Post text required." });
  // next();
  const body = req.body;
  console.log(body);
  const { text } = body;
  if (!text) {
    res
      .status(400)
      .json({ message: "User Name required." });
  }
  else if (!body) {
    res
      .status(400)
      .json({ message: "User data required." });
  } else {
    next();
  }

}

module.exports = router;
