const db = require('../models');
const User = db.rest.models.user;
const jwt = require("jsonwebtoken")

//API to test  the passport middleware 
exports.TestPassport = async (req,res)=>{
  res.json("you have 2800 in you're account")
}

exports.LoginUser = async (req,res)=>{
  const {username,password} = req.body;
  const UserwithUsername = await User.findOne({where:{username,}}).catch((err)=>{
    return res.status(400).send({
      message: "Something went wrong",
      error:err
    });
  });
  if(!UserwithUsername)
    return res.status(400).send({
    
    message: 'Invalid username',
  });
  //First method to query a password from db 

  // const UserwithPasssword = await User.findOne({where:{password,}}).catch((err)=>{
  //   return res.status(400).send({
  //     message: err,
  //   });
  // });
  // if(!UserwithPasssword)
  //   return res.status(400).send({
  //   message: 'Invalid password',
  // });

  //Or we can lookup the password from that specific email that we found in the UserwithUsername
  if(UserwithUsername.password !== password)
    return res.status(400).send({
      message:"Invalid password "
    })
  const jwtToken = jwt.sign({
    id:UserwithUsername.id,
    username:UserwithUsername.username
  },process.env.JWT_SECRET);
  
  return res.status(200).send({
    message:'Succesfully logged in ',
    token:jwtToken
  });
};  




exports.getAllUsers = async (req,res)=>{
  const user = await User.findAll();
  if (!user.length || !user) {
    return res.status(400).send({
      message: `No users to show at the moment`});
  }
  return res.send(user);
};  

exports.getUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id,
    },
  });

  if (!user) {
    return res.status(400).send({
      message: `No user found with the id ${id}`,
    });
  }

  return res.send(user);
};

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({
      message: 'Please provide a username and a password to create a user!',
    });
  }

  let usernameExists = await User.findOne({
    where: {
      username,
    },
  });

  if (usernameExists) {
    return res.status(400).send({
      message: 'An account with that username already exists!',
    });
  }
  
  try {
    const jwtToken = jwt.sign({
      id:User.id,
      username:User.username
    },process.env.JWT_SECRET);

    let newUser = await User.create({ 
      username,
      password,
      jwtToken,
    });
    return res.send({newUser,jwtToken});
    return res.status(200).send({
      message: 'Succesfully registered user!',
      data:newUser,
      token:jwtToken
    });
  } catch (err) {
    return res.status(500).send({
      message: `Error: ${err.message}`,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      message: 'Please provide a id for the user you are trying to delete!',
    });
  }

  const user = await User.findOne({
    where: {
      id,
    },
  });

  if (!user) {
    return res.status(400).send({
      message: `No user found with the id ${id}`,
    });
  }

  try {
    await user.destroy();
    return res.send({
      message: `User ${id} has been deleted!`,
    });
  } catch (err) {
    return res.status(500).send({
      message: `Error: ${err.message}`,
    });
  }
};

exports.updateUser = async (req, res) => {
  const { username, password } = req.body;
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id,
    },
  });

  if (!user) {
    return res.status(400).send({
      message: `No user found with the id ${id}`,
    });
  }

  try {
    if (username) {
      user.username = username;
    }
    if (password) {
      user.password = password;
    }

    user.save();
    return res.send({
      message: `User ${id} has been updated!`,
    });
  } catch (err) {
    return res.status(500).send({
      message: `Error: ${err.message}`,
    });
  }
};
