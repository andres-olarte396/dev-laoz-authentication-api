const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const roles = ['admin', 'user', 'guest'];
const permissions = ['read', 'write', 'delete'];

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: roles, default: 'user' },
  permissions: { type: [String], enum: permissions, default: ['read'] },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.hasPermission = function (permission) {
  return this.permissions.includes(permission);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
