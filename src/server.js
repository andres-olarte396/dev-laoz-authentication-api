const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const swaggerDocs = require('./config/swagger');
const bodyParser = require('body-parser');

dotenv.config();
connectDB();

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

swaggerDocs(app);

const PORT = process.env.LOCAL_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Authentication API running on port ${PORT}`);
});
