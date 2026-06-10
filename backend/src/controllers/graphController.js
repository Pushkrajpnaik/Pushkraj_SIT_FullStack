const GraphProcessor = require('../core/GraphProcessor');

const processor = new GraphProcessor();

exports.processGraph = (req, res) => {
  try {
    const { edges } = req.body;

    if (!edges || !Array.isArray(edges)) {
      return res.status(400).json({
        success: false,
        error: "Invalid input. 'edges' must be an array of strings."
      });
    }

    const result = processor.process(edges);
    res.json(result);
  } catch (error) {
    console.error('Processing Error:', error);
    res.status(500).json({
      success: false,
      error: "Internal server error occurred while processing graph."
    });
  }
};

exports.healthCheck = (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
};
