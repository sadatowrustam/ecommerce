const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, 'rustam', {
    
    expiresIn: '24h',
  });
};

exports.createSendToken = (user, statusCode, res) => {
  const token = signToken(user.seller_id);
  user.password = undefined;

  res.status(statusCode).json({
    token,
    data: {
      user,
    },
  });
};
