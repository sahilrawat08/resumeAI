import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { uploadAPI, resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface UploadFormData {
  title: string;
  jobDescription: string;
}

const ResumeUpload: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UploadFormData>();

  const handleResumeUpload = async (file: File) => {
    try {
      const response = await uploadAPI.uploadResume(file);
      setResumeText(response.extractedText);
      toast.success('Resume processed successfully');
    } catch (error) {
      toast.error('Failed to process resume');
    }
  };

  const handleJobDescriptionUpload = async (file: File) => {
    try {
      const response = await uploadAPI.uploadJobDescription(file);
      setJobDescriptionText(response.extractedText);
      toast.success('Job description processed successfully');
    } catch (error) {
      toast.error('Failed to process job description');
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!resumeText) {
      toast.error('Please upload and process a resume first');
      return;
    }

    setLoading(true);
    try {
      await resumeAPI.createResume({
        title: data.title,
        content: resumeText,
        jobDescription: jobDescriptionText || data.jobDescription
      });
      
      toast.success('Resume saved successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Resume</h1>
        <p className="text-gray-600">Upload your resume and job description for AI-powered optimization</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Resume Upload */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Resume Upload</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (PDF or DOCX)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="resume-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="resume-upload"
                        name="resume-upload"
                        type="file"
                        accept=".pdf,.docx,.doc"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setResumeFile(file);
                            handleResumeUpload(file);
                          }
                        }}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOCX up to 10MB</p>
                </div>
              </div>
              {resumeFile && (
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {resumeFile.name} uploaded successfully
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Job Description Upload */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Job Description</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Job Description (PDF or DOCX) - Optional
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="job-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="job-upload"
                        name="job-upload"
                        type="file"
                        accept=".pdf,.docx,.doc"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setJobDescriptionFile(file);
                            handleJobDescriptionUpload(file);
                          }
                        }}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOCX up to 10MB</p>
                </div>
              </div>
              {jobDescriptionFile && (
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {jobDescriptionFile.name} uploaded successfully
                </div>
              )}
            </div>

            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Or paste job description text
              </label>
              <textarea
                {...register('jobDescription')}
                rows={6}
                className="input-field"
                placeholder="Paste the job description here..."
                disabled={!!jobDescriptionText}
              />
            </div>
          </div>
        </div>

        {/* Resume Details */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Resume Details</h2>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Resume Title
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              className="input-field"
              placeholder="e.g., Software Engineer Resume"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !resumeText}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : null}
            Save Resume
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeUpload;


