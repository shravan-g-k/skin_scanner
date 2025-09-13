require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const { analyzeSkinCondition } = require("./ai.js");
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies, allow large images
app.use(cors()); // Enable CORS for all routes

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

/**
 * POST /analyze
 *
 * Input (JSON body):
 * {
 *   base64Image: string, // The image of the skin condition, base64 encoded
 *   mimeType: string     // The MIME type of the image (e.g., 'image/jpeg', 'image/png')
 * }
 *
 * Output (JSON):
 * {
 *   conditionName: string,      // Common name of the potential skin condition
 *   description: string,        // Detailed description of the condition
 *   symptoms: string[],         // List of common symptoms
 *   suggestions: string[]       // General suggestions, starting with a recommendation to consult a healthcare professional
 * }
 */
app.post("/analyze", async (req, res) => {
  const { base64Image, mimeType } = req.body;
  if (!base64Image || !mimeType) {
    return res.status(400).json({ error: "Missing base64Image or mimeType in request body." });
  }
  try {
    const result = await analyzeSkinCondition(base64Image, mimeType);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to analyze image." });
  }
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  console.log(`Example app listening on port ${port}`);
});
