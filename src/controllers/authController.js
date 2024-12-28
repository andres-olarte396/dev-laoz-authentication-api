const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const Session = require('../models/Session');
const User = require('../models/User'); 

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generar un token único para la sesión
    const sessionToken = crypto.randomBytes(64).toString("hex");

    // Definir la caducidad de la sesión (por ejemplo, 1 hora)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Crear y guardar la sesión en la base de datos
    const session = new Session({
      sessionToken,
      userId: user._id,
      expiresAt
    });

    await Session.create(session);

    return res.status(200).json({
      token: generateToken(sessionToken),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  loginUser,
};
