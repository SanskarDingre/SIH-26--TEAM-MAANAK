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
    officerDecision: {
    type: String,
    enum: ['confirmed', 'overridden', null],
    default: null,
  },
  officerNote: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Inspection', inspectionSchema);