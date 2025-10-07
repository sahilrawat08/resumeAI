const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeText: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'txt'],
    required: true
  },
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  matchedKeywords: [{
    keyword: String,
    category: String, // 'skill', 'technology', 'experience', etc.
    relevance: Number // 0-1 score
  }],
  missingKeywords: [{
    keyword: String,
    category: String,
    importance: Number // 0-1 score
  }],
  suggestions: [{
    type: String,
    category: String, // 'grammar', 'content', 'formatting', 'keywords'
    priority: String // 'high', 'medium', 'low'
  }],
  readabilityScore: {
    type: Number,
    min: 0,
    max: 100
  },
  modelConfidence: {
    type: Number,
    min: 0,
    max: 100
  },
  improvementPotential: {
    type: Number,
    min: 0,
    max: 100
  },
  keywordMatchRatio: {
    type: Number,
    min: 0,
    max: 1
  },
  skillMatchRatio: {
    type: Number,
    min: 0,
    max: 1
  },
  actionVerbCount: {
    type: Number,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
analysisSchema.index({ user: 1, createdAt: -1 });
analysisSchema.index({ atsScore: -1 });

module.exports = mongoose.model('Analysis', analysisSchema);

