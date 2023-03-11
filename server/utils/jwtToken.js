// Create and send token and save it cookie
const sendToken = (user, res) => {
  // Create JWT Token
  const token = user.getJwtToken();
  // Option for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  return res.status(200).cookie("token", token, options).json({
    success: true,
    data: token,
  });
};

module.exports = sendToken;
