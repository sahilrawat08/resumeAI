import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeAPI, aiAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Brain, Download, RefreshCw, CheckCircle, AlertTriangle, Target } from 'lucide-react';

interface Resume {
  _id: string;
  title: string;
  content: string;
  jobDescription: string;
  analysis: any;
  optimizedContent: string;
}

const ResumeAnalysis: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchResume();
    }
  }, [id]);

  const fetchResume = async () => {
    try {
      const data = await resumeAPI.getResume(id!);
      setResume(data);
    } catch (error) {
      toast.error('Failed to fetch resume');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resume) return;

    setAnalyzing(true);
    try {
      const analysis = await aiAPI.analyzeResume(resume.content, resume.jobDescription);
      
      // Update resume with analysis
      const updatedResume = await resumeAPI.updateResume(resume._id, {
        analysis: analysis.analysis
      });
      
      setResume(updatedResume);
      toast.success('Analysis completed successfully');
    } catch (error) {
      toast.error('Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleOptimize = async () => {
    if (!resume) return;

    setOptimizing(true);
    try {
      const optimization = await aiAPI.optimizeResume(resume.content, resume.jobDescription);
      
      // Update resume with optimized content
      const updatedResume = await resumeAPI.updateResume(resume._id, {
        optimizedContent: optimization.optimizedResume
      });
      
      setResume(updatedResume);
      toast.success('Resume optimization completed');
    } catch (error) {
      toast.error('Failed to optimize resume');
    } finally {
      setOptimizing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Resume not found</h3>
        <p className="text-gray-600 mb-6">The resume you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{resume.title}</h1>
        <p className="text-gray-600">AI-powered resume analysis and optimization</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Analysis Panel */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Analysis & Optimization</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="btn-secondary disabled:opacity-50"
                >
                  {analyzing ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Brain className="h-4 w-4 mr-2" />
                  )}
                  Analyze
                </button>
                <button
                  onClick={handleOptimize}
                  disabled={optimizing || !resume.analysis}
                  className="btn-primary disabled:opacity-50"
                >
                  {optimizing ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Target className="h-4 w-4 mr-2" />
                  )}
                  Optimize
                </button>
              </div>
            </div>

            {resume.analysis && (
              <div className="space-y-4">
                {/* Overall Score */}
                {resume.analysis.optimizationSuggestions?.overallScore && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Overall Score</span>
                      <span className="text-2xl font-bold text-primary-600">
                        {resume.analysis.optimizationSuggestions.overallScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${resume.analysis.optimizationSuggestions.overallScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Missing Keywords */}
                {resume.analysis.optimizationSuggestions?.missingKeywords?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Missing Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {resume.analysis.optimizationSuggestions.missingKeywords.map((keyword: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills to Emphasize */}
                {resume.analysis.optimizationSuggestions?.skillsToEmphasize?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Skills to Emphasize</h3>
                    <div className="flex flex-wrap gap-2">
                      {resume.analysis.optimizationSuggestions.skillsToEmphasize.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section Improvements */}
                {resume.analysis.optimizationSuggestions?.sectionImprovements && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Section Improvements</h3>
                    <div className="space-y-2">
                      {Object.entries(resume.analysis.optimizationSuggestions.sectionImprovements).map(([section, suggestion]) => (
                        <div key={section} className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                          <h4 className="font-medium text-gray-900 capitalize">{section}</h4>
                          <p className="text-sm text-gray-700 mt-1">{suggestion as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ATS Optimization */}
                {resume.analysis.optimizationSuggestions?.atsOptimization && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">ATS Optimization</h3>
                    <div className="p-3 bg-green-50 border-l-4 border-green-400">
                      <p className="text-sm text-gray-700">{resume.analysis.optimizationSuggestions.atsOptimization}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Resume Content Panel */}
        <div className="space-y-6">
          {/* Original Resume */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Original Resume</h2>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{resume.content}</pre>
            </div>
          </div>

          {/* Optimized Resume */}
          {resume.optimizedContent && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Optimized Resume</h2>
                <button className="btn-secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">{resume.optimizedContent}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysis;


