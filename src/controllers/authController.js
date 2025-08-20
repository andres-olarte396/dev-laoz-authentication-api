const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const Session = require('../models/Session');
const User = require('../models/User'); 


// Genera access token y refresh token
const generateTokens = (userId, sessionToken) => {
  const accessToken = jwt.sign(
    { userId, sessionToken },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  // Refresh token: solo estructura, no persistencia ni endpoint
  const refreshToken = jwt.sign(
    { userId, sessionToken },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
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

    const { accessToken, refreshToken } = generateTokens(user._id, sessionToken);
    return res.status(200).json({
      token: accessToken,
      refreshToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


// Controlador para refresh token
const refreshTokenController = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token requerido' });
  }
  try {
    // Verificar refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    // Validar que la sesión exista y esté activa
    const session = await Session.findOne({ sessionToken: decoded.sessionToken, userId: decoded.userId, isActive: true });
    if (!session) {
      return res.status(401).json({ error: 'Refresh token inválido o sesión expirada' });
    }
    // Emitir nuevo access token
    const accessToken = jwt.sign(
      { userId: decoded.userId, sessionToken: decoded.sessionToken },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.status(200).json({ token: accessToken });
  } catch (error) {
    return res.status(401).json({ error: 'Refresh token inválido o expirado' });
  }
};

module.exports = {
  loginUser,
  refreshTokenController,
};
