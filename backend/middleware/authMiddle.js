const Usersign = require("../model/user")
const jwt = require("jsonwebtoken")

const protect = async (req, res, next) => {
  const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({message:"Not authorized, please login"});
    }
    try {
      // Verify Token
      const {_id} = jwt.verify(token, process.env.Secret);
      // Get user id from token
       req.user = await Usersign.findById({_id}).select("-password");

      next();
    } catch (error) {
      res.status(401).json({message: "Not authorized, please login"});
    }
  };

module.exports = protect;