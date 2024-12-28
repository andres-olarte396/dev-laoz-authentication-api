const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  sessionToken: { type: String, required: true, unique: true }, // Token único para la sesión
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario
  createdAt: { type: Date, default: Date.now }, // Fecha de creación
  expiresAt: { type: Date, required: true }, // Fecha de expiración
  isActive: { type: Boolean, default: true }, // Estado de la sesión
});

module.exports = mongoose.model('Session', SessionSchema);
