const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt:{
    type: String,
    required: true
  }
});

// Create the model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
