const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
  extractedFields: {
    productName: String,
    manufacturer: String,
    mrp: String,
    netQuantity: String,
  },
  rawText: String,
  missingFields: [String],
  status: {
    type: String,
    enum: ['compliant', 'non-compliant'],
    default: 'non-compliant',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Inspection', inspectionSchema);