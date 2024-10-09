const User = require('../model/userModel');
const bcrypt = require("bcrypt");


module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const userCheck = await User.findOne({ username });
    if (userCheck) {
      return res.status(400).json({ msg: "Username already exists", status: false });
    }

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(400).json({ msg: "Email already exists", status: false });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashPassword
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({ status: true, user: userResponse });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Duplicate key error", status: false });
    }
    next(err);
  }
};

module.exports.login = async (req , res , next) =>  {
    try {
      const { username , password} = req.body ;
    const user = await User.findOne({ username });
    if (!user){
        return res.json({msg : "Incorrect username" , status : false });
    }
    const isPasswordCorrect = await bcrypt.compare(password , user.password);
    if (!isPasswordCorrect){
        return res.json({msg : "Incorrect Password" , status : false });
    }
    delete user.password;
    return res.json({status : true, user});
} catch(err) {
    next(err)
}
}

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ msg: "User id is required " });
    }
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
