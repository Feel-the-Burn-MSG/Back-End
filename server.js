const express = require('express');

// const helmet = require('helmet');

const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

const server = express();

server.use(express.json(), logger);

server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

server.get('/', (req, res) => {
  const message = process.env.MSG || "Hello World"
  res.json({ message });
});

//custom middleware

function logger(req, res, next) {
  const newDate = new Date(Date.now());
  console.log((`${req.method} to ${req.originalUrl} at ${newDate.toDateString()}, ${newDate.toTimeString()}`))
  next();
};

module.exports = server;
