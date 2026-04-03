const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from the backend root
dotenv.config({ path: path.resolve(__dirname, "../backend/.env") });

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
     const result = await modelText.generateContent("Enhance this prompt for a thumbnail: Gaming highlights");
     console.log("Text Result:", result.response.text());
     
     // Test Image generation (Imagen)
     console.log("\n2. Testing Image Generation (Imagen)...");
     const modelImage = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });
     try {
        const resultImage = await modelImage.generateContent("A simple thumbnail showing a game controller with neon lights");
        console.log("Image generation response received.");
        if (resultImage.response?.candidates) {
            console.log("Found image candidates!");
        }
     } catch (imgErr) {
        console.warn("Image Generation failed (likely because specific Imagen model is not available in your region/API tier):", imgErr.message);
     }

  } catch (err) {
     console.error("\nCRITICAL FAILURE:", err.message);
  }
}

testGemini();
