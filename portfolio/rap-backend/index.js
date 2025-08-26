import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import fetch from 'node-fetch';

dotenv.config();
console.log('OpenAI API Key status:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
const app = express();
app.use(cors());
app.use(express.json());

// Add a test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Proxy endpoint to fetch and convert images
app.post('/proxy-image', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      throw new Error('No image URL provided');
    }

    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    // Get the image as a buffer
    const imageBuffer = await response.buffer();
    
    // Convert to base64
    const base64Image = `data:${response.headers.get('content-type')};base64,${imageBuffer.toString('base64')}`;
    
    res.json({ base64Image });
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test OpenAI connection
app.get('/test-openai', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }
    
    // Test with a simple completion
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Say hello" }],
      model: "gpt-3.5-turbo",
      max_tokens: 10
    });

    res.json({ 
      status: 'success',
      message: 'OpenAI connection successful',
      response: chatCompletion.choices[0].message.content
    });
  } catch (error) {
    console.error('OpenAI API test error:', error);
    res.status(500).json({ 
      status: 'error',
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate-rap-name', async (req, res) => {
  const {
    firstName, lastName, age, hairColor, favoriteFood, favoriteColor, favoriteAnimal
  } = req.body;

  const prompt = `
  Create a fun and unique rap name for a person with the following traits:
  - First Name: ${firstName}
  - Last Name: ${lastName}
  - Age: ${age}
  - Hair Color: ${hairColor}
  - Favorite Food: ${favoriteFood}
  - Favorite Color: ${favoriteColor}
  - Favorite Animal: ${favoriteAnimal}

  The rap name should be catchy and sound like a real artist.
  Return only the rap name with no explanation.
  `;

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 30,
      temperature: 0.8
    });

    const rapName = chatCompletion.choices[0].message.content.trim();
    res.json({ rapName });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/generate-rapper-image', async (req, res) => {
    const {
      firstName, age, hairColor, favoriteFood, favoriteColor, favoriteAnimal
    } = req.body;
  
    const prompt = `Create a realistic image of a rapper named ${firstName}, age ${age}, with ${hairColor} hair, wearing ${favoriteColor} clothing, holding ${favoriteFood}, standing next to a ${favoriteAnimal}. Make it stylish, urban, and suitable for a debut rap album cover.`;
  
    try {
      console.log('Attempting to generate image with prompt:', prompt);
      console.log('OpenAI configuration:', {
        apiKeyPresent: !!process.env.OPENAI_API_KEY,
        model: 'dall-e-3'
      });
      
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      console.log('Making API request to OpenAI...');
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024"
      });
      console.log('OpenAI API response received:', response);
  
      if (!response.data || !response.data[0] || !response.data[0].url) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from OpenAI API');
      }

      const imageUrl = response.data[0].url;
      console.log('Successfully generated image:', imageUrl);
      res.json({ imageUrl });
    } catch (error) {
      console.error('Error in image generation:', {
        message: error.message,
        type: error.constructor.name,
        stack: error.stack,
        response: error.response?.data
      });
      
      res.status(500).json({ 
        error: error.message,
        details: error.response?.data || 'No additional details available'
      });
    }
  });
  


app.listen(3001, () => {
  console.log('🔥 Rap Name Generator backend is running on http://localhost:3001');
});
