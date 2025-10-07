import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Brain, 
  BarChart3, 
  Zap, 
  User,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  CheckCircle,
  Star
} from 'lucide-react';

const Home: React.FC = () => {
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

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced NLP algorithms analyze your resume and job descriptions for optimal ATS compatibility.',
      color: 'from-[#4f9dff] to-[#3b82f6]'
    },
    {
      icon: Target,
      title: 'ATS Optimization',
      description: 'Get real-time ATS scores and personalized recommendations to pass automated screening.',
      color: 'from-[#a78bfa] to-[#8b5cf6]'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Comprehensive insights into keyword matching, skill gaps, and improvement areas.',
      color: 'from-[#10b981] to-[#059669]'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get your analysis in seconds with actionable feedback and improvement suggestions.',
      color: 'from-[#f59e0b] to-[#d97706]'
    }
  ];

  const stats = [
    { number: '95%', label: 'ATS Pass Rate', icon: Target },
    { number: '50K+', label: 'Resumes Analyzed', icon: FileText },
    { number: '98%', label: 'User Satisfaction', icon: Star },
    { number: '2.5x', label: 'Interview Rate', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-[#4f9dff]/20 to-[#a78bfa]/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-[#10b981]/20 to-[#f59e0b]/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-10 p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#4f9dff] to-[#a78bfa] rounded-2xl flex items-center justify-center shadow-2xl">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient-primary">ResumeAI</span>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="btn-ghost"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        className="relative z-10 py-24 px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div variants={itemVariants} className="mb-8">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#262626]/50 rounded-full text-sm text-[#4f9dff] mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Resume Optimization
            </motion.div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              Optimize Your Resume with{' '}
              <span className="text-gradient-primary">AI Intelligence</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Transform your resume into an ATS-friendly masterpiece with advanced AI analysis, 
              real-time scoring, and personalized recommendations.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Free Analysis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                Sign In
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            variants={itemVariants}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#4f9dff]/20 to-[#a78bfa]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-[#4f9dff]" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="relative z-10 py-24 px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for{' '}
              <span className="text-gradient-accent">Resume Success</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI-powered platform provides everything you need to create a winning resume 
              that passes ATS screening and impresses recruiters.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card p-8 text-center hover-lift"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="relative z-10 py-24 px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="glass-card p-12"
            variants={itemVariants}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-[#4f9dff] to-[#a78bfa] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Resume?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of professionals who have optimized their resumes and landed their dream jobs.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="relative z-10 py-12 px-6 border-t border-[#262626]/50"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4f9dff] to-[#a78bfa] rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient-primary">ResumeAI</span>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered resume optimization platform helping professionals land their dream jobs.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/upload" className="hover:text-white transition-colors">Resume Analysis</Link></li>
                <li><Link to="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
                <li><Link to="/insights" className="hover:text-white transition-colors">AI Insights</Link></li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:support@resumeai.com" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="mailto:contact@resumeai.com" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </motion.div>
          </div>
          <div className="border-t border-[#262626]/50 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ResumeAI. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;