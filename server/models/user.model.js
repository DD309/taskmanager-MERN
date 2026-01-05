const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * @desc    Mongoose schema for the User model.
 *          defines structure of a user document in the MongoDB database.
 */
const userSchema = new Schema({
  //sername must be a unique, min of 3.
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
}, {
  timestamps: true,
});

//create the user model from the schema.
const User = mongoose.model('User', userSchema);

module.exports = User;