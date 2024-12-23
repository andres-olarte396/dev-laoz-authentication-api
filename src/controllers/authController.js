const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const registerUser = async (req, res) => {
  const { username, password, role, permissions } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({ username, password, role, permissions });
    res.status(201).json({
      _id: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        _id: user.id,
        username: user.username,
        role: user.role,
        permissions: user.permissions,
        token: generateToken(user.id),
      });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
