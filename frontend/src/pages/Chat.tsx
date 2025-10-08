import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, Plus, LogOut, FileText, Loader, Paperclip, X, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { analysisAPI, uploadAPI, chatAPI } from '../services/api';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Analysis {
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

interface ChatSession {
  _id: string;
  title: string;
  resumeFileName?: string;
  atsScore?: number;
  createdAt: string;
  updatedAt: string;
}

const Chat: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await chatAPI.getHistory();
      setChatHistory(response.sessions || []);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentAnalysis(null);
    setJobDescription('');
    setUploadedFile(null);
    setResumeText('');
    setInput('');
    setCurrentSessionId(null);
  };

  const loadChatSession = async (sessionId: string) => {
    try {
      const response = await chatAPI.getSession(sessionId);
      const session = response.session;
      
      setMessages(session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
      
      if (session.atsScore) {
        setCurrentAnalysis({ 
          atsScore: session.atsScore,
          matchedKeywords: [],
          missingKeywords: [],
          suggestions: []
        });
      }
      
      setCurrentSessionId(sessionId);
      toast.success('Chat session loaded!');
    } catch (error) {
      console.error('Failed to load chat session:', error);
      toast.error('Failed to load chat session');
    }
  };

  const deleteChatSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this chat?')) {
      return;
    }

    try {
      await chatAPI.deleteSession(sessionId);
      setChatHistory(prev => prev.filter(s => s._id !== sessionId));
      
      if (currentSessionId === sessionId) {
        handleNewChat();
      }
      
      toast.success('Chat deleted!');
    } catch (error) {
      console.error('Failed to delete chat session:', error);
      toast.error('Failed to delete chat');
    }
  };

  const saveChatSession = async () => {
    try {
      const sessionData = {
        title: uploadedFile?.name || `Chat ${new Date().toLocaleDateString()}`,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        })),
        resumeFileName: uploadedFile?.name,
        atsScore: currentAnalysis?.atsScore,
        sessionId: currentSessionId || undefined
      };

      const response = await chatAPI.saveSession(sessionData);
      
      if (!currentSessionId) {
        setCurrentSessionId(response.session._id);
        loadChatHistory(); // Refresh history
      }
    } catch (error) {
      console.error('Failed to save chat session:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, Word, or TXT file');
      return;
    }

    setUploadedFile(file);
    setLoading(true);

    try {
      const response = await uploadAPI.uploadResume(file);
      setResumeText(response.text);
      
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `📎 Uploaded: ${file.name}`,
        timestamp: new Date(),
      };

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Great! I've received your resume "${file.name}". Now, please paste the job description you're targeting.`,
        timestamp: new Date(),
      };

      setMessages([userMessage, aiMessage]);
      toast.success('Resume uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload resume. Please try again.');
      setUploadedFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // If no resume yet (neither uploaded nor pasted)
      if (!resumeText && !uploadedFile) {
        // Store as resume text
        setResumeText(input);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Got it! I\'ve received your resume. Now, please paste the job description you\'re targeting.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setLoading(false);
        return;
      }

      // Now we have the job description - analyze!
      const fileType = uploadedFile 
        ? (uploadedFile.type.includes('pdf') ? 'pdf' : 'txt')
        : 'txt';
      
      const response = await analysisAPI.analyzeResume({
        resumeText: resumeText,
        jobDescription: input,
        fileName: uploadedFile?.name || 'resume.txt',
        fileType: fileType,
      });

      setCurrentAnalysis(response.analysis);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `✅ **Analysis Complete!**\n\n**ATS Score: ${response.analysis.atsScore}%**\n\n**Matched Keywords:**\n${response.analysis.matchedKeywords.join(', ')}\n\n**Missing Keywords:**\n${response.analysis.missingKeywords.join(', ')}\n\n**Suggestions:**\n${response.analysis.suggestions.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      toast.success('Analysis complete!');

      // Save chat session after analysis
      setTimeout(() => saveChatSession(), 500);
    } catch (error: any) {
      console.error('❌ Analysis error:', error);
      console.error('❌ Error response:', error.response?.data);
      const errorMsg = error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || 'Analysis failed';
      toast.error(errorMsg);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMsg}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-[#171717] border-r border-gray-800 flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-4 py-3 bg-[#0a0a0a] hover:bg-[#1a1a1a] rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>New Analysis</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-sm text-gray-400 mb-2">History</div>
          {chatHistory.length === 0 ? (
            <div className="text-xs text-gray-500 text-center py-4">
              No history yet
            </div>
          ) : (
            <div className="space-y-1">
              {chatHistory.map((session) => (
                <div
                  key={session._id}
                  onClick={() => loadChatSession(session._id)}
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    currentSessionId === session._id
                      ? 'bg-blue-600/20 border border-blue-600/50'
                      : 'hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="flex-shrink-0 text-gray-400" />
                      <span className="text-sm truncate">{session.title}</span>
                    </div>
                    {session.atsScore && (
                      <div className="text-xs text-gray-500 mt-1">
                        Score: <span className={session.atsScore >= 70 ? 'text-green-400' : session.atsScore >= 50 ? 'text-yellow-400' : 'text-red-400'}>{session.atsScore}%</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => deleteChatSession(session._id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-opacity"
                    title="Delete"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="mb-3 px-2">
            <div className="text-sm font-medium">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-gray-400">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <FileText size={20} className="text-blue-400" />
            <h1 className="text-xl font-semibold">ResumeAI</h1>
          </div>
          {currentAnalysis && (
            <div className="text-sm">
              <span className="text-gray-400">ATS Score: </span>
              <span className={`font-bold ${currentAnalysis.atsScore >= 70 ? 'text-green-400' : currentAnalysis.atsScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {currentAnalysis.atsScore}%
              </span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileText size={64} className="text-gray-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Resume Analysis Assistant</h2>
              <p className="text-gray-400 max-w-md">
                Paste your resume text below to get started with AI-powered ATS analysis
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#1a1a1a] text-gray-100 border border-gray-800'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-60 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#1a1a1a] rounded-2xl px-4 py-3 border border-gray-800">
                    <Loader className="animate-spin" size={20} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-800 p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            {/* File upload indicator */}
            {uploadedFile && (
              <div className="mb-3 flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-lg">
                <FileText size={16} className="text-blue-400" />
                <span className="text-sm text-blue-300">{uploadedFile.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedFile(null);
                    setResumeText('');
                    handleNewChat();
                  }}
                  className="ml-auto p-1 hover:bg-blue-600/30 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex gap-3 items-end">
              {/* File Upload Button */}
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={loading || (resumeText !== '' && !uploadedFile)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading || (resumeText !== '' && !uploadedFile)}
                  className="p-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
                  title="Upload resume (PDF, Word, or TXT)"
                >
                  <Paperclip size={20} />
                </button>
              </div>

              {/* Text Input */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={
                  !resumeText && !uploadedFile
                    ? "Paste your resume text here or click 📎 to upload a file..."
                    : "Now paste the job description..."
                }
                className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32"
                rows={3}
                disabled={loading}
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl transition-colors"
              >
                <Send size={20} />
              </button>
            </div>

            <div className="text-xs text-gray-500 mt-2 text-center">
              {!resumeText && !uploadedFile 
                ? '📎 Upload resume (PDF, Word, TXT) or paste text • Then add job description' 
                : resumeText && !jobDescription 
                ? 'Step 2: Paste the job description' 
                : 'Press Enter to send, Shift+Enter for new line'}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;

