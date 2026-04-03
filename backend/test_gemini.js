const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

// Load local .env
dotenv.config();

async function testGemini() {
  const GEMINI_KEY = (process.env.GEMINI_API_KEY || process.env.IMAGE_GEN_API_KEY)?.trim();
  
  if (!GEMINI_KEY) {
     console.error("No GEMINI_API_KEY found in .env!");
     return;
  }

  console.log("Testing Gemini with key length:", GEMINI_KEY.length);
  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  
  try {
     // Test simple text generation first (Gemini 1.5 Flash)
     console.log("1. Testing Text Generation (Refinement)...");
     const modelText = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
     const result = await modelText.generateContent("Describe a high-CTR thumbnail for a gaming video.");
     console.log("Refinement Result:", result.response.text().substring(0, 100) + "...");
     
     // Test Image generation (Imagen)
     console.log("\n2. Testing Image Generation (Imagen)...");
     const modelImage = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });
     try {
        const resultImage = await modelImage.generateContent("A simple thumbnail showing a neon controller");
        console.log("Image response received successfully.");
     } catch (imgErr) {
        console.warn("\nImage Generation API error (Might be restricted for your API key/region):", imgErr.message);
     }

  } catch (err) {
     console.error("\nCRITICAL FAILURE:", err.message);
  }
}

testGemini();
