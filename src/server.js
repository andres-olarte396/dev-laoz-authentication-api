const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const swaggerDocs = require('./config/swagger');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

swaggerDocs(app);

const PORT = process.env.LOCAL_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
