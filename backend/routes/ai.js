const express = require('express');
const OpenAI = require('openai');
const natural = require('natural');
const auth = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Analyze resume and job description
router.post('/analyze', auth, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: 'Resume text and job description are required' });
    }

    // Extract keywords from job description
    const jobKeywords = extractKeywords(jobDescription);
    
    // Analyze resume sections
    const resumeAnalysis = analyzeResume(resumeText);
    
    // Generate AI-powered optimization suggestions
    const optimizationPrompt = `
    Analyze this resume and job description to provide optimization suggestions:

    RESUME:
    ${resumeText}

    JOB DESCRIPTION:
    ${jobDescription}

    Please provide:
    1. Missing keywords that should be added
    2. Skills that should be emphasized
    3. Experience gaps to address
    4. Suggested improvements for each section
    5. ATS optimization recommendations

    Format your response as JSON with the following structure:
    {
      "missingKeywords": ["keyword1", "keyword2"],
      "skillsToEmphasize": ["skill1", "skill2"],
      "experienceGaps": ["gap1", "gap2"],
      "sectionImprovements": {
        "summary": "suggestion",
        "experience": "suggestion",
        "skills": "suggestion",
        "education": "suggestion"
      },
      "atsOptimization": "suggestion",
      "overallScore": 85
    }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert resume optimization specialist. Provide detailed, actionable suggestions for improving resumes to match job requirements."
        },
        {
          role: "user",
          content: optimizationPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const aiResponse = completion.choices[0].message.content;
    let optimizationSuggestions;

    try {
      optimizationSuggestions = JSON.parse(aiResponse);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      optimizationSuggestions = {
        missingKeywords: jobKeywords.slice(0, 10),
        skillsToEmphasize: [],
        experienceGaps: [],
        sectionImprovements: {
          summary: "Consider adding a professional summary highlighting key achievements",
          experience: "Quantify your achievements with specific metrics",
          skills: "Include more technical skills relevant to the job",
          education: "Add relevant certifications or courses"
        },
        atsOptimization: "Ensure consistent formatting and include relevant keywords",
        overallScore: 75
      };
    }

    res.json({
      message: 'Analysis completed successfully',
      analysis: {
        jobKeywords,
        resumeAnalysis,
        optimizationSuggestions
      }
    });

  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ message: 'Error analyzing resume' });
  }
});

// Generate optimized resume content
router.post('/optimize', auth, async (req, res) => {
  try {
    const { resumeText, jobDescription, optimizationFocus } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: 'Resume text and job description are required' });
    }

    const optimizationPrompt = `
    Optimize this resume to better match the job description:

    ORIGINAL RESUME:
    ${resumeText}

    JOB DESCRIPTION:
    ${jobDescription}

    OPTIMIZATION FOCUS: ${optimizationFocus || 'General optimization'}

    Please provide an optimized version of the resume that:
    1. Includes relevant keywords from the job description
    2. Emphasizes matching skills and experience
    3. Uses action verbs and quantifiable achievements
    4. Maintains professional formatting
    5. Is ATS-friendly

    Return the optimized resume text directly without additional commentary.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer. Optimize resumes to match job requirements while maintaining authenticity and professionalism."
        },
        {
          role: "user",
          content: optimizationPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 3000
    });

    const optimizedResume = completion.choices[0].message.content;

    res.json({
      message: 'Resume optimization completed',
      optimizedResume: optimizedResume
    });

  } catch (error) {
    console.error('Resume optimization error:', error);
    res.status(500).json({ message: 'Error optimizing resume' });
  }
});

// Helper function to extract keywords
function extractKeywords(text) {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase());
  
  // Remove stop words and short words
  const stopWords = natural.stopwords;
  const filteredTokens = tokens.filter(token => 
    token.length > 3 && 
    !stopWords.includes(token) &&
    !/^\d+$/.test(token) // Remove pure numbers
  );
  
  // Get word frequency
  const wordFreq = {};
  filteredTokens.forEach(token => {
    wordFreq[token] = (wordFreq[token] || 0) + 1;
  });
  
  // Sort by frequency and return top keywords
  return Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([word]) => word);
}

// Helper function to analyze resume structure
function analyzeResume(text) {
  const sections = {
    contact: /(email|phone|address|contact)/i.test(text),
    summary: /(summary|objective|profile)/i.test(text),
    experience: /(experience|work history|employment)/i.test(text),
    education: /(education|degree|university|college)/i.test(text),
    skills: /(skills|technical|competencies)/i.test(text)
  };

  const wordCount = text.split(/\s+/).length;
  const hasNumbers = /\d+/.test(text);
  const hasActionVerbs = /(managed|developed|created|implemented|led|designed|built|improved|increased|reduced)/i.test(text);

  return {
    sections,
    wordCount,
    hasNumbers,
    hasActionVerbs,
    completeness: Object.values(sections).filter(Boolean).length / Object.keys(sections).length * 100
  };
}

module.exports = router;
