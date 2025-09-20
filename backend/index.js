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

/**
 * POST /find-dermatologists
 *
 * Input (JSON body):
 * {
 *   lat: number,
 *   lng: number
 * }
 *
 * Output (JSON):
 *   { places: DermatologistPlace[] }
 */
app.post("/find-dermatologists", async (req, res) => {
  const { lat, lng } = req.body;
  const apiKey = process.env.PLACES_API_KEY;
  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing lat or lng in request body." });
  }
  if (!apiKey) {
    return res.status(500).json({ error: "Google Places API key not configured on server." });
  }
  try {
    const searchQueries = [
      "dermatologist",
      "skin specialist",
      "dermatology clinic",
      "skin doctor",
      "dermatologist hospital"
    ];
    let allResults = [];
    for (const query of searchQueries) {
      const textSearchBody = {
        textQuery: query,
        maxResultCount: 10,
        locationBias: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 5.0,
          },
        },
        rankPreference: "DISTANCE",
      };
      const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.businessStatus,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.regularOpeningHours,places.types",
        },
        body: JSON.stringify(textSearchBody),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.places && data.places.length > 0) {
          allResults.push(...data.places);
        }
      }
    }
    // Remove duplicates and filter for dermatology-related places
    const uniquePlaces = allResults.filter((place, index, self) =>
      index === self.findIndex((p) => p.displayName?.text === place.displayName?.text)
    );
    const dermatologyPlaces = uniquePlaces.filter((place) => {
      const name = place.displayName?.text?.toLowerCase() || '';
      const address = place.formattedAddress?.toLowerCase() || '';
      if (name.includes('veterinary') || name.includes('animal') || name.includes('pet')) return false;
      return name.includes('dermat') || 
             name.includes('skin') || 
             address.includes('dermat') ||
             (name.includes('clinic') && !name.includes('tb') && !name.includes('tuberculosis')) ||
             (name.includes('hospital') && !name.includes('veterinary') && !name.includes('tb') && !name.includes('tuberculosis')) ||
             name.includes('medical center') ||
             name.includes('specialist');
    });
    res.json({ places: dermatologyPlaces });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to search dermatologists." });
  }
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  console.log(`Example app listening on port ${port}`);
});
