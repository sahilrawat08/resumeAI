import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import { FileText, Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Resume {
  _id: string;
  title: string;
  content: string;
  jobDescription: string;
  analysis: any;
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const data = await resumeAPI.getResumes();
      setResumes(data);
    } catch (error) {
      toast.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await resumeAPI.deleteResume(id);
        setResumes(resumes.filter(resume => resume._id !== id));
        toast.success('Resume deleted successfully');
      } catch (error) {
        toast.error('Failed to delete resume');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your resumes and track your optimization progress</p>
      </div>

      <div className="mb-6">
        <Link
          to="/upload"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Upload New Resume
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
          <p className="text-gray-600 mb-6">Get started by uploading your first resume for AI optimization</p>
          <Link
            to="/upload"
            className="btn-primary"
          >
            Upload Resume
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <div key={resume._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-primary-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{resume.title}</h3>
                    <p className="text-sm text-gray-500">
                      Created {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/analysis/${resume._id}`}
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteResume(resume._id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {resume.content.substring(0, 150)}...
                </p>
              </div>

              {resume.analysis && resume.analysis.overallScore && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Optimization Score</span>
                    <span className="text-sm font-bold text-primary-600">
                      {resume.analysis.overallScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${resume.analysis.overallScore}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <Link
                  to={`/analysis/${resume._id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View Analysis
                </Link>
                <span className="text-xs text-gray-500">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;


