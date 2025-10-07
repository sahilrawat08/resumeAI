const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'text/plain'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and TXT files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// @route   POST /api/upload
// @desc    Upload and extract text from resume file
// @access  Private
router.post('/', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'txt';
    let extractedText = '';

    if (fileType === 'pdf') {
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
      } catch (error) {
        console.error('PDF parsing error:', error);
        return res.status(400).json({ error: 'Failed to parse PDF file' });
      }
    } else if (fileType === 'txt') {
      try {
        extractedText = fs.readFileSync(filePath, 'utf8');
      } catch (error) {
        console.error('TXT reading error:', error);
        return res.status(400).json({ error: 'Failed to read text file' });
      }
    }

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    // Basic validation
    if (!extractedText.trim()) {
      return res.status(400).json({ error: 'No text content found in the file' });
    }

    res.json({
      success: true,
      extractedText: extractedText.trim(),
      fileName: req.file.originalname,
      fileType: fileType,
      fileSize: req.file.size
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Server error during file upload' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  
  if (error.message === 'Only PDF and TXT files are allowed') {
    return res.status(400).json({ error: error.message });
  }
  
  res.status(500).json({ error: 'File upload error' });
});

module.exports = router;

