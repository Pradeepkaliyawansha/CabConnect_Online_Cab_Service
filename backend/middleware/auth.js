const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    return user;
  } catch (error) {
    return null;
  }
};

module.exports = { verifyToken };
