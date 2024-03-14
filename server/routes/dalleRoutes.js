import express from 'express';
import * as dotenv from 'dotenv';
import Replicate from 'replicate';
import fetch from 'node-fetch';




dotenv.config();

const router = express.Router();
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});


router.route('/').get((req, res) => {
    res.send('Hello from DALL-E!' );
});

router.route('/').post(async (req, res) => {
    try {
      const { prompt } = req.body;
  
      const aiResponse = await replicate.run(
        process.env.REPLICATE_MODEL_ID,
        {
          input: {
            prompt: prompt,
          },
        }
        
      );
  

      const image = aiResponse[0];
      const imageResponse = await fetch(image);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }
      console.log(aiResponse)
      // Get the image buffer
      const imageBuffer = await imageResponse.buffer();
  
      // Set appropriate headers for image display
      const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
  
      // Send the Base64 string to the client
      res.send(base64Image);

    }catch (error) {
        console.error(error);
        res.status(500).send(error?.response.data.error.message || 'Something went wrong');
      }
    });

export default router;