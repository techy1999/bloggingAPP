const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Check if the use is AUTHENTICATED or not
exports.isAuthenticatedUser = async (req, res, next) => {
  let token;

  // Checking bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      res.send({
        error: "Unauthorized access.",
        message: null,
        httpStatus: 401,
        data: null,
      })
    );
  }

  // Verify jwt
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);

  next();
};
