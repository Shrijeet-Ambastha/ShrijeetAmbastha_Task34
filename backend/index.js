// const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// const express = require('express');
// const cors = require('cors'); // 1. Require cors
// const mongoose = require('mongoose');
// const routes = require('./routes');

// const app = express(); // 2. Initialize app FIRST
// const PORT = process.env.PORT || 3000;

// // 3. Use middleware AFTER app is initialized
// app.use(cors()); 
// app.use(express.json());

// // 4. Mount routes
// app.use('/api', routes);

// // 5. Connect DB and start server
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log('Connected to MongoDB Atlas');
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('Failed to connect to MongoDB:', err.message);
//   });

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Database Connection helper (cached for serverless)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  const db = await mongoose.connect(process.env.MONGODB_URI);
  isConnected = db.connections[0].readyState;
};

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed: ' + err.message });
  }
});

// For local development only:
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel Serverless
module.exports = app;