import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Brain, 
  Target, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
  BarChart3,
  PieChart,
  FileText,
  Sparkles,
  Star,
  Award
} from 'lucide-react';
import { analysisAPI, resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

interface AnalysisData {
  _id: string;
  fileName: string;
  atsScore: number;
  jobDescription: string;
  resumeText: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  modelConfidence: number;
  improvementPotential: number;
  createdAt: string;
}

const ResumeAnalysis: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalysis = useCallback(async () => {
    try {
      const response = await analysisAPI.getAnalysis(id!);
      setAnalysis(response.analysis);
    } catch (error) {
      console.error('Error fetching analysis:', error);
      toast.error('Failed to load analysis');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchAnalysis();
    }
  }, [id, fetchAnalysis]);

  const handleExport = async () => {
    if (!analysis) return;

    try {
      const blob = await resumeAPI.exportAnalysis(analysis._id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-analysis-${analysis.fileName}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('Analysis exported successfully!');
    } catch (error) {
      console.error('Error exporting analysis:', error);
      toast.error('Failed to export analysis');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-[#10b981] to-[#059669]';
    if (score >= 60) return 'from-[#f59e0b] to-[#d97706]';
    return 'from-[#ef4444] to-[#dc2626]';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  // Chart data
  const scoreData = [
    { name: 'ATS Score', value: analysis?.atsScore || 0, color: '#4f9dff' },
    { name: 'Improvement', value: analysis ? 100 - analysis.atsScore : 0, color: '#6b7280' }
  ];

  const keywordData = [
    { name: 'Matched', value: analysis?.matchedKeywords.length || 0, color: '#10b981' },
    { name: 'Missing', value: analysis?.missingKeywords.length || 0, color: '#ef4444' }
  ];

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-[#4f9dff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analysis...</p>
        </motion.div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Analysis not found</h1>
          <Link to="/upload" className="btn-primary">
            Upload New Resume
          </Link>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/dashboard"
              className="btn-ghost flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex-1" />
            <motion.button
              onClick={handleExport}
              className="btn-secondary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          </div>
          
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient-primary">Resume Analysis</span>
          </h1>
          <p className="text-xl text-gray-400">
            Analysis for: <span className="text-white font-medium">{analysis.fileName}</span>
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Score Overview */}
          <motion.div variants={itemVariants}>
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4f9dff] to-[#3b82f6] rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">ATS Compatibility Score</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Main Score */}
                <div className="md:col-span-2">
                  <div className="score-circle w-48 h-48 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#262626"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.atsScore / 100)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#4f9dff" />
                          <stop offset="100%" stopColor="#a78bfa" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="score-text">
                      <div className="text-5xl font-bold text-white">{analysis.atsScore}</div>
                      <div className="text-sm text-gray-400">out of 100</div>
                    </div>
                  </div>
                </div>

                {/* Score Details */}
                <div className="space-y-4">
                  <div className="p-4 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#262626]/50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 bg-gradient-to-br ${getScoreColor(analysis.atsScore)} rounded-lg flex items-center justify-center`}>
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{getScoreLabel(analysis.atsScore)}</h3>
                        <p className="text-sm text-gray-400">Overall Rating</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#262626]/50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-lg flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{analysis.modelConfidence}%</h3>
                        <p className="text-sm text-gray-400">AI Confidence</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#262626]/50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{analysis.improvementPotential}%</h3>
                        <p className="text-sm text-gray-400">Improvement Potential</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Keyword Analysis Chart */}
            <motion.div variants={itemVariants}>
              <div className="chart-container">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Keyword Analysis</h3>
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={keywordData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="name" stroke="#a3a3a3" />
                    <YAxis stroke="#a3a3a3" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #262626',
                        borderRadius: '12px',
                        color: '#ffffff'
                      }} 
                    />
                    <Bar dataKey="value" fill="#4f9dff" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Score Distribution */}
            <motion.div variants={itemVariants}>
              <div className="chart-container">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Score Distribution</h3>
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={scoreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {scoreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #262626',
                        borderRadius: '12px',
                        color: '#ffffff'
                      }} 
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Keywords Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Matched Keywords */}
            <motion.div variants={itemVariants}>
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Matched Keywords</h3>
                  <span className="px-3 py-1 bg-[#10b981]/20 text-[#10b981] rounded-full text-sm font-medium">
                    {analysis.matchedKeywords.length}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedKeywords.map((keyword, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-3 py-1 bg-[#10b981]/20 text-[#10b981] rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Missing Keywords */}
            <motion.div variants={itemVariants}>
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#ef4444] to-[#dc2626] rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Missing Keywords</h3>
                  <span className="px-3 py-1 bg-[#ef4444]/20 text-[#ef4444] rounded-full text-sm font-medium">
                    {analysis.missingKeywords.length}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((keyword, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-3 py-1 bg-[#ef4444]/20 text-[#ef4444] rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Suggestions Section */}
          <motion.div variants={itemVariants}>
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">AI-Powered Suggestions</h2>
              </div>

              <div className="space-y-4">
                {analysis.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#262626]/50 rounded-2xl"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#4f9dff] to-[#3b82f6] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-300 leading-relaxed">{suggestion}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeAnalysis;