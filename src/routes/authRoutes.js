const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const checkPermission = require('../middleware/permissionsMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: El usuario ya existe
 *       500:
 *         description: Error del servidor
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error del servidor
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/auth/read:
 *   get:
 *     summary: Accede a un recurso protegido
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acceso concedido
 *       403:
 *         description: Acceso denegado
 */
router.get('/read', checkPermission('read'), (req, res) => {
  res.status(200).json({ message: 'Read resource' });
});

/**
 * @swagger
 * /api/auth/write:
 *   get:
 *     summary: Accede a un recurso protegido
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acceso concedido
 *       403:
 *         description: Acceso denegado
 */
router.post('/write', checkPermission('write'), (req, res) => {
  res.status(200).json({ message: 'Write resource' });
});

/**
 * @swagger
 * /api/auth/delete:
 *   get:
 *     summary: Accede a un recurso protegido
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acceso concedido
 *       403:
 *         description: Acceso denegado
 */
router.delete('/delete', checkPermission('delete'), (req, res) => {
  res.status(200).json({ message: 'Delete resource' });
});

module.exports = router;
