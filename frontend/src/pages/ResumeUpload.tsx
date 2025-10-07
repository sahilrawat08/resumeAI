import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  Brain, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import { uploadAPI, analysisAPI } from '../services/api';
import toast from 'react-hot-toast';

const ResumeUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      toast.success('File uploaded successfully!');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !jobDescription.trim()) {
      toast.error('Please upload a file and provide a job description');
      return;
    }

    setLoading(true);

    try {
      // Upload file
      const uploadResponse = await uploadAPI.uploadResume(file);
      
      // Analyze resume
      const analysisResponse = await analysisAPI.analyzeResume({
        resumeText: uploadResponse.text,
        jobDescription: jobDescription.trim(),
        fileName: file.name,
        fileType: file.type
      });

      toast.success('Analysis completed successfully!');
      navigate(`/analysis/${analysisResponse.analysis._id}`);
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    toast.success('File removed');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="lg:ml-80 p-6">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient-primary">AI Resume Analysis</span>
          </h1>
          <p className="text-xl text-gray-400">
            Upload your resume and job description for comprehensive AI-powered analysis
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* File Upload Section */}
            <motion.div variants={itemVariants}>
              <div className="card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4f9dff] to-[#3b82f6] rounded-2xl flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Upload Resume</h2>
                </div>

                <div
                  {...getRootProps()}
                  className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-500 cursor-pointer ${
                    isDragActive || dragActive
                      ? 'border-[#4f9dff] bg-[#4f9dff]/10'
                      : 'border-[#262626] hover:border-[#4f9dff]/50 hover:bg-[#4f9dff]/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  
                  <motion.div
                    className="space-y-4"
                    animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-[#4f9dff]/20 to-[#a78bfa]/20 rounded-3xl flex items-center justify-center mx-auto">
                      <FileText className="w-10 h-10 text-[#4f9dff]" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {isDragActive ? 'Drop your file here' : 'Drag & drop your resume'}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Supports PDF and TXT files up to 10MB
                      </p>
                      <div className="btn-secondary inline-flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Choose File
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* File Preview */}
                <AnimatePresence>
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-6 p-4 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#262626]/50 rounded-2xl"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{file.name}</p>
                            <p className="text-sm text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <motion.button
                          type="button"
                          onClick={removeFile}
                          className="p-2 text-gray-400 hover:text-[#ef4444] transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Job Description Section */}
            <motion.div variants={itemVariants}>
              <div className="card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] rounded-2xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Job Description</h2>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Paste the job description you're applying for
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="textarea-field h-32"
                    placeholder="Paste the complete job description here. This helps our AI analyze how well your resume matches the requirements..."
                    required
                  />
                  <p className="text-sm text-gray-400">
                    The more detailed the job description, the better our analysis will be.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Analysis Features */}
            <motion.div variants={itemVariants}>
              <div className="card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">AI Analysis Features</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#262626]/50 rounded-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#4f9dff] to-[#3b82f6] rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">ATS Score</h3>
                        <p className="text-sm text-gray-400">Compatibility rating</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#262626]/50 rounded-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] rounded-xl flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Keyword Matching</h3>
                        <p className="text-sm text-gray-400">Skill alignment analysis</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#262626]/50 rounded-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Improvement Tips</h3>
                        <p className="text-sm text-gray-400">Personalized suggestions</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#262626]/50 rounded-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">AI Insights</h3>
                        <p className="text-sm text-gray-400">Advanced recommendations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="text-center">
              <motion.button
                type="submit"
                disabled={loading || !file || !jobDescription.trim()}
                className="btn-primary text-lg px-12 py-4 flex items-center gap-3 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Analyze Resume
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
              
              {(!file || !jobDescription.trim()) && (
                <p className="text-sm text-gray-400 mt-4">
                  Please upload a file and provide a job description to continue
                </p>
              )}
            </motion.div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;