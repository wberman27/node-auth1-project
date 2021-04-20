const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')
const KnexSessionsStore = require('connect-session-knex')(session)
/**
  Do what needs to be done to support sessions with the `express-session` package!
  To respect users' privacy, do NOT send them a cookie unless they log in.
  This is achieved by setting 'saveUninitialized' to false, and by not
  changing the `req.session` object unless the user authenticates.

  Users that do authenticate should have a session persisted on the server,
  and a cookie set on the client. The name of the cookie should be "chocolatechip".

  The session can be persisted in memory (would not be adecuate for production)
  or you can use a session store like `connect-session-knex`.
 */

const server = express();

//cookie and session config
server.use(session({
  name: 'chocolatechip',
  secret: 'One Ring, to Rule Them All.',
  cookie: {
    maxAge: 1000 * 60 * 30,
    secure: false,
    httpOnly: false
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionsStore({
    knex: require('../data/db-config'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createTable: true,
    clearInterval: 1000 * 60 * 30
  })
}))

server.use(express.json()); // THIS has to be above the routers ****
server.use('/api/users', usersRouter) //these must be below the session config
server.use('/api/auth', authRouter)
server.use(helmet());
server.use(cors());

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
