// Available ai_engine options (confirmed with API):
// - stable-diffusion-xl-pro  (best for photorealistic people/portraits)
// - flux                      (best for general purpose)
// - midjourney                (best for artistic/stylised)
//
// Default engine for this project: stable-diffusion-xl-pro
// (best results for therapy/wellness photography)

require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const [,, prompt, filename, dimension = 'large'] = process.argv;

if (!prompt || !filename) {
  console.error('Usage: node generate-image.js "prompt" filename.jpg [dimension]');
  process.exit(1);
}

const apiKey = process.env.AIRBRUSH_API_KEY;
if (!apiKey) {
  console.error('Error: AIRBRUSH_API_KEY not found in .env');
  process.exit(1);
}

async function generate() {
  console.log(`Generating: ${prompt}`);
  console.log(`Saving to: images/${filename}`);

  let response;
  try {
    response = await fetch('https://app.airbrush.ai/create-art-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        content: prompt,
        ai_engine: 'stable-diffusion-xl-pro',
        image_dimensions: dimension,
        negative_prompt: 'blurry, low quality, distorted faces, watermark, text overlay, cartoon, illustration, ugly, deformed',
      }),
    });
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(1);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    console.error('Failed to parse response JSON:', err.message);
    process.exit(1);
  }

  if (!response.ok || data.error) {
    console.error('API error response:', JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const imageUrl = data?.data?.image_url;
  if (!imageUrl) {
    console.error('No image_url in response:', JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const creditsRemaining = data?.data?.credits_remaining ?? data?.credits_remaining ?? 'unknown';
  console.log(`Credits remaining: ${creditsRemaining}`);

  const imgResponse = await fetch(imageUrl);
  if (!imgResponse.ok) {
    console.error(`Failed to download image: ${imgResponse.status} ${imgResponse.statusText}`);
    process.exit(1);
  }

  const outputPath = path.join(__dirname, 'images', filename);
  const fileStream = fs.createWriteStream(outputPath);

  await new Promise((resolve, reject) => {
    imgResponse.body.pipe(fileStream);
    imgResponse.body.on('error', reject);
    fileStream.on('finish', resolve);
  });

  console.log('Done.');
}

generate();
