const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  streamId: { type: String, required: true, unique: true },
  firstname: { type: String },
  lastname: { type: String },
});

module.exports = mongoose.model('User', userSchema);