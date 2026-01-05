const jwt = require('jsonwebtoken');

/**
 * @desc    express middleware for authenticating and authorizing the users.
 *          runs before any protected route handler. checks for a
 *          valid JWT in the request header and if valid,
 *          attaches the users id to the request object.
 *
 * @param   {object} req - express request object.
 * @param   {object} res - express response object.
 * @param   {function} next - the next middleware function in the stack.
 */
const auth = (req, res, next) => {
  try {
    //get the token from the 'x-auth-token' header.
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'No authentication token, authorization denied.' });
    }

    //verify the token using the secret key.
    //this will throw an error if the token is invalid or expired.
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ msg: 'Token verification failed, authorization denied.' });
    }

    //attach the users id (from the tokens payload) to the request object.
    //this makes the users id available to all subsequent protected route handlers.
    req.user = verified.id;
    
    //pass control to the next middleware function.
    next();
  } catch (err) {
    //if jwt.verify fails, it throws an error which is caught here.
    res.status(401).json({ msg: 'Token is not valid, authorization denied.' });
  }
};

module.exports = auth;