require('dotenv').config();
const express = require('express');
const cors = require('cors');
const graphRoutes = require('./routes/graphRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

console.log('--- Startup Config ---');
console.log('Detected PORT:', process.env.PORT);
console.log('Using PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('----------------------');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: "GraphInsight API is running", version: "1.0.0" });
});
app.use('/api', graphRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing
