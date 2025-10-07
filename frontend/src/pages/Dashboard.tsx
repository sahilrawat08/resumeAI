import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  FileText, 
  Brain, 
  Target,
  Zap,
  BarChart3,
  Plus,
  Eye,
  Download,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { resumeAPI } from '../services/api';
import toast from 'react-hot-toast';

interface Analysis {
  _id: string;
  fileName: string;
  atsScore: number;
  createdAt: string;
  modelConfidence: number;
  improvementPotential: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    averageScore: 0,
    recentAnalyses: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analysesResponse, statsResponse] = await Promise.all([
        resumeAPI.getAnalyses(1, 5),
        resumeAPI.getStats()
      ]);
      
      setAnalyses(analysesResponse.analyses);
      setStats(statsResponse.stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-[#4f9dff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </motion.div>
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
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="text-gradient-primary">{user?.firstName}</span>! 👋
          </h1>
          <p className="text-xl text-gray-400">
            Ready to optimize your resume and land your dream job?
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <div className="stat-card hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Analyses</p>
                  <p className="text-3xl font-bold text-white">{stats.totalAnalyses}</p>
                  <p className="text-sm text-[#10b981] flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4" />
                    +12% this month
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#4f9dff] to-[#3b82f6] rounded-2xl flex items-center justify-center shadow-2xl">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="stat-card hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Average Score</p>
                  <p className="text-3xl font-bold text-white">{stats.averageScore}%</p>
                  <p className="text-sm text-[#10b981] flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-4 h-4" />
                    +5% improvement
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] rounded-2xl flex items-center justify-center shadow-2xl">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="stat-card hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">AI Accuracy</p>
                  <p className="text-3xl font-bold text-white">94.2%</p>
                  <p className="text-sm text-[#10b981] flex items-center gap-1 mt-2">
                    <Brain className="w-4 h-4" />
                    High confidence
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl flex items-center justify-center shadow-2xl">
                  <Brain className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="stat-card hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Improvement</p>
                  <p className="text-3xl font-bold text-white">{Math.max(0, 100 - stats.averageScore)}%</p>
                  <p className="text-sm text-[#f59e0b] flex items-center gap-1 mt-2">
                    <Zap className="w-4 h-4" />
                    Potential growth
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-2xl flex items-center justify-center shadow-2xl">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Analyses */}
          <motion.div 
            className="lg:col-span-2"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-[#4f9dff]" />
                  Recent Analyses
                </h2>
                <motion.button
                  className="btn-primary flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                  New Analysis
                </motion.button>
              </div>

              {analyses.length === 0 ? (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-[#4f9dff]/20 to-[#a78bfa]/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-12 h-12 text-[#4f9dff]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No analyses yet</h3>
                    <p className="text-gray-400 mb-6">Upload your first resume to get started</p>
                    <motion.button
                      className="btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze Resume
                    </motion.button>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-4">
                  {analyses.map((analysis, index) => (
                    <motion.div
                      key={analysis._id}
                      className="p-4 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#262626]/50 rounded-2xl hover:border-[#4f9dff]/30 transition-all duration-500"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-2">{analysis.fileName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(analysis.createdAt).toLocaleDateString()}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getScoreColor(analysis.atsScore)}`}>
                              {analysis.atsScore}% - {getScoreLabel(analysis.atsScore)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            className="p-2 text-gray-400 hover:text-[#4f9dff] transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="p-2 text-gray-400 hover:text-[#10b981] transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="p-2 text-gray-400 hover:text-[#ef4444] transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Performance Overview */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <div className="card p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#4f9dff]" />
                Performance Overview
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#262626]/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Analyses Completed</p>
                      <p className="text-sm text-gray-400">Total resume analyses</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#10b981]">
                    {stats.totalAnalyses}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#262626]/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4f9dff] to-[#3b82f6] rounded-2xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Average Score</p>
                      <p className="text-sm text-gray-400">ATS compatibility</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#4f9dff]">
                    {stats.averageScore}%
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#262626]/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-2xl flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Improvement Potential</p>
                      <p className="text-sm text-gray-400">Room for growth</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#f59e0b]">
                    {Math.max(0, 100 - stats.averageScore)}%
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-[#4f9dff]/10 to-[#a78bfa]/10 border border-[#4f9dff]/20 rounded-2xl">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#4f9dff]" />
                  Pro Tip
                </h4>
                <p className="text-sm text-gray-300">
                  Aim for an ATS score above 80% for the best chances of passing automated screening systems.
                  Focus on matching keywords from job descriptions and quantifying your achievements.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;