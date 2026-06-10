const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');

// Main processing endpoint as per PDF: POST /api/graph
router.post('/graph', graphController.processGraph);

// Health check endpoint
router.get('/health', graphController.healthCheck);

module.exports = router;
