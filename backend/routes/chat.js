const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const ChatHistory = require('../models/ChatHistory');

const router = express.Router();

// @route   GET /api/chat/history
// @desc    Get all chat sessions for the logged-in user
// @access  Private
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const chatSessions = await ChatHistory.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select('title resumeFileName atsScore createdAt updatedAt')
      .limit(50);

    res.json({
      success: true,
      sessions: chatSessions
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Server error while fetching chat history' });
  }
});

// @route   GET /api/chat/:id
// @desc    Get a specific chat session with all messages
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const chatSession = await ChatHistory.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json({
      success: true,
      session: chatSession
    });
  } catch (error) {
    console.error('Error fetching chat session:', error);
    res.status(500).json({ error: 'Server error while fetching chat session' });
  }
});

// @route   POST /api/chat
// @desc    Create a new chat session or add message to existing
// @access  Private
router.post(
  '/',
  authMiddleware,
  [
    body('title').optional().trim().isLength({ min: 1, max: 200 }),
    body('messages').isArray().withMessage('Messages must be an array'),
    body('resumeFileName').optional().trim(),
    body('atsScore').optional().isNumeric().isFloat({ min: 0, max: 100 }),
    body('sessionId').optional().isMongoId()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, messages, resumeFileName, atsScore, sessionId } = req.body;

      if (sessionId) {
        // Update existing session
        const chatSession = await ChatHistory.findOne({
          _id: sessionId,
          userId: req.user._id
        });

        if (!chatSession) {
          return res.status(404).json({ error: 'Chat session not found' });
        }

        // Add new messages
        chatSession.messages.push(...messages);
        if (atsScore !== undefined) {
          chatSession.atsScore = atsScore;
        }
        chatSession.updatedAt = new Date();

        await chatSession.save();

        res.json({
          success: true,
          session: chatSession
        });
      } else {
        // Create new session
        const newSession = new ChatHistory({
          userId: req.user._id, // Fixed: use req.user._id
          title: title || resumeFileName || `Chat ${new Date().toLocaleDateString()}`,
          messages: messages || [],
          resumeFileName,
          atsScore
        });

        await newSession.save();

        res.json({
          success: true,
          session: newSession
        });
      }
    } catch (error) {
      console.error('Error saving chat session:', error);
      res.status(500).json({ error: 'Server error while saving chat session' });
    }
  }
);

// @route   DELETE /api/chat/:id
// @desc    Delete a chat session
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const chatSession = await ChatHistory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json({
      success: true,
      message: 'Chat session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    res.status(500).json({ error: 'Server error while deleting chat session' });
  }
});

module.exports = router;

