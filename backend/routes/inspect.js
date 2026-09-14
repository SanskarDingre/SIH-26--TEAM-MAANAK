const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const { checkCompliance } = require('../services/complianceChecker');
const Inspection = require('../models/Inspection');

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

        // Run the extracted text through the compliance rule engine
    const result = checkCompliance(ocrResponse.data.lines);

    // Save this inspection permanently to MongoDB
    const savedInspection = await Inspection.create({
      extractedFields: result.extractedFields,
      rawText: result.rawText,
      missingFields: result.missingFields,
      status: result.status,
    });

        res.json({
      status: result.status,
      extractedFields: result.extractedFields,
      missingFields: result.missingFields,
      evidence: result.evidence,
      inspectionId: savedInspection._id,
      rawText: result.rawText,
    });

  } catch (error) {
    console.error('Error during inspection:', error.message);
    res.status(500).json({ error: 'Something went wrong during inspection' });
  }
});
router.get('/history', async (req, res) => {
  try {
    const inspections = await Inspection.find().sort({ createdAt: -1 }).limit(20);
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch inspection history' });
  }
});
router.patch('/inspect/:id/verify', async (req, res) => {
  try {
    const { decision, note } = req.body;
    const updated = await Inspection.findByIdAndUpdate(
      req.params.id,
      { officerDecision: decision, officerNote: note || '' },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Could not save verification' });
  }
});
module.exports = router;
