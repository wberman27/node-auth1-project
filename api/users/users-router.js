const router = require('express').Router();
const { restricted } = require('../auth/auth-middleware');
const Users = require('./users-model')

router.get('/', restricted, (req,res)=>{
  Users.find()
  .then(user =>{
    res.status(200).json(user)
  })
  .catch(() =>{
    res.status(401).json({message: "You shall not pass!"})
  })
})
// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!


/**
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */


// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;