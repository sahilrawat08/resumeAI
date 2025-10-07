const express = require('express');
const Analysis = require('../models/Analysis');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/resume/analyses
// @desc    Get all analyses for the current user
// @access  Private
router.get('/analyses', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const analyses = await Analysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-resumeText -jobDescription'); // Exclude large text fields

    const total = await Analysis.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      analyses,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get analyses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/resume/analyses/:id
// @desc    Get specific analysis with full details
// @access  Private
router.get('/analyses/:id', authMiddleware, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/resume/analyses/:id
// @desc    Delete a specific analysis
// @access  Private
router.delete('/analyses/:id', authMiddleware, async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    // Remove from user's analyses array
    await req.user.updateOne({ $pull: { analyses: analysis._id } });

    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    });
  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/resume/stats
// @desc    Get user's analysis statistics
// @access  Private
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalAnalyses = await Analysis.countDocuments({ user: req.user._id });
    
    const avgScore = await Analysis.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, avgScore: { $avg: '$atsScore' } } }
    ]);

    const scoreDistribution = await Analysis.aggregate([
      { $match: { user: req.user._id } },
      {
        $bucket: {
          groupBy: '$atsScore',
          boundaries: [0, 25, 50, 75, 100],
          default: 'Other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    const recentAnalyses = await Analysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('atsScore createdAt fileName');

    res.json({
      success: true,
      stats: {
        totalAnalyses,
        averageScore: avgScore.length > 0 ? Math.round(avgScore[0].avgScore) : 0,
        scoreDistribution,
        recentAnalyses
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/resume/export/:id
// @desc    Export analysis as JSON
// @access  Private
router.get('/export/:id', authMiddleware, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const exportData = {
      fileName: analysis.fileName,
      fileType: analysis.fileType,
      atsScore: analysis.atsScore,
      matchedKeywords: analysis.matchedKeywords,
      missingKeywords: analysis.missingKeywords,
      suggestions: analysis.suggestions,
      readabilityScore: analysis.readabilityScore,
      modelConfidence: analysis.modelConfidence,
      improvementPotential: analysis.improvementPotential,
      createdAt: analysis.createdAt,
      exportedAt: new Date()
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="resume-analysis-${analysis._id}.json"`);
    res.json(exportData);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

