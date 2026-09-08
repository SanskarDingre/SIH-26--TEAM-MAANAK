const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();

// Store uploaded photos temporarily in memory (not saved to disk)
const upload = multer({ storage: multer.memoryStorage() });

router.post('/inspect', upload.single('image'), async (req, res) => {
  try {
    // Build a form to send the image to the Python OCR service
    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);

    // Send the image to the OCR service and wait for the text result
    const ocrResponse = await axios.post(process.env.OCR_SERVICE_URL, formData, {
      headers: formData.getHeaders(),
    });

    // For now, just send the raw OCR result back so we can see it works
    res.json({ ocrResult: ocrResponse.data });

  } catch (error) {
    console.error('Error during inspection:', error.message);
    res.status(500).json({ error: 'Something went wrong during inspection' });
  }
});

module.exports = router;
