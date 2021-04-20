const Users = require('../users/users-model')
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if(req.session.user){
    next()
  }else{
    next({message: "You shall not pass!", status:401})
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req,res,next) {
  try{
    let usersArray = []
    const user = await Users.find()
    user.map(u => {
      usersArray.push(u.username)
      return usersArray;
    })
    if(usersArray.includes(req.body.username)){
      next({message: "Username taken", status: 422})
    }else{
      next()
    }
  }catch(err){
    next(err)
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  try{
    const user = await Users.findBy({username: req.body.username})
    if(!user){
      next({message: "Invalid credentials", status: 401})
    }else{
      next()
    }
  }catch(err){
    next(err)
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  try{
    const {password} = req.body
    if(password.length < 3 || !password){
      next({message: "Password must be longer than 3 chars", status: 422})
    }else{
      next()
    }
  }catch(err){
    next(err)
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
  restricted
}