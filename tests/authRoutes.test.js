// Pruebas para el endpoint /api/auth/login usando Jest y supertest
const request = require('supertest');
const app = require('../src/server');

// Mock de los controladores para evitar dependencias externas
jest.mock('../src/controllers/authController', () => ({
  loginUser: (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }
    if (username === 'usuario' && password === 'password') {
      return res.status(200).json({ token: 'mocked-access-token', refreshToken: 'mocked-refresh-token' });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  },
  refreshTokenController: (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token requerido' });
    }
    if (refreshToken === 'mocked-refresh-token') {
      return res.status(200).json({ token: 'nuevo-access-token' });
    }
    return res.status(401).json({ error: 'Refresh token inválido o expirado' });
  }
}));

// Pruebas para el endpoint /api/auth/login
describe('POST /api/auth/login', () => {
  it('debería responder 200 si el login es exitoso', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'usuario', password: 'password' });
    expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('token', 'mocked-access-token');
  expect(res.body).toHaveProperty('refreshToken', 'mocked-refresh-token');
  });

  it('debería responder 401 si las credenciales son inválidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'usuario', password: 'incorrecta' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });

  it('debería responder 400 si falta algún campo', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'usuario' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Datos incompletos');
  });
});

// Pruebas para el endpoint /api/auth/refresh
describe('POST /api/auth/refresh', () => {
  it('debería responder 200 y retornar un nuevo token si el refreshToken es válido', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'mocked-refresh-token' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token', 'nuevo-access-token');
  });

  it('debería responder 400 si falta el refreshToken', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Refresh token requerido');
  });

  it('debería responder 401 si el refreshToken es inválido', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'token-invalido' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});

// Pruebas para el endpoint /api/auth/logout
describe('POST /api/auth/logout', () => {
  it('debería responder 200 si la sesión se cierra correctamente', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: 'mocked-refresh-token' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Sesión cerrada correctamente');
  });

  it('debería responder 400 si falta el refreshToken', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Refresh token requerido');
  });

  it('debería responder 401 si el refreshToken es inválido', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: 'token-invalido' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
