const { GoogleGenAI, Type } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    conditionName: {
      type: Type.STRING,
      description: "The common name of the potential skin condition.",
    },
    description: {
      type: Type.STRING,
      description:
        "A detailed and neutral description of what the skin condition is.",
    },
    symptoms: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of common symptoms associated with the condition.",
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description:
        "A list of general, non-prescriptive suggestions for next steps. This MUST start with a strong recommendation to consult a qualified healthcare professional.",
    },
    severity: {
      type: Type.STRING,
      description: "Severity of the condition: low, medium, or high. Always return one of these three values.",
      enum: ["low", "medium", "high"]
    },
  },
  required: ["conditionName", "description", "symptoms", "suggestions", "severity"],
};

const analyzeSkinCondition = async (base64Image, mimeType) => {
  const prompt = `Analyze the provided image of a skin condition. Based on the visual evidence, identify the most likely dermatological condition. Provide a detailed, structured explanation in JSON format. The explanation should include:
1. The common name of the potential condition.
2. A clear, concise description of what the condition is.
3. A list of typical symptoms associated with this condition.
4. A list of general, non-prescriptive suggestions for next steps.
5. A severity field (low, medium, or high) that reflects the risk or urgency of the condition.
IMPORTANT: Your response MUST NOT be considered medical advice. Start the suggestions with a strong recommendation to consult a qualified healthcare professional or dermatologist for an accurate diagnosis and treatment plan. If the image is not clear, or does not appear to show a skin condition, respond with an analysis that indicates this. The severity field must always be one of: low, medium, or high.`;

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: prompt,
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
    },
  });

  const jsonText = response.text.trim();

  try {
    const parsedJson = JSON.parse(jsonText);
    return parsedJson;
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonText);
    throw new Error("AI returned an invalid response format.");
  }
};

module.exports = { analyzeSkinCondition };
