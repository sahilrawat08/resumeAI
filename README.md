# ResumeAI - AI-Powered Resume Optimization Platform

A comprehensive full-stack application that uses AI to analyze and optimize resumes for better job application success.

## 🚀 Features

- **PDF/DOCX Resume Parsing**: Upload and extract text from PDF and Word documents
- **AI-Powered Analysis**: Analyze resumes against job descriptions using OpenAI GPT-4
- **Smart Optimization**: Get personalized suggestions for keyword optimization, ATS compatibility, and content improvements
- **Real-time Processing**: Instant analysis and optimization suggestions
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Helmet** for security
- **Express Rate Limit** for API protection

### AI/ML & File Processing
- **OpenAI GPT-4 API** for AI analysis
- **pdf-parse** for PDF text extraction
- **Mammoth.js** for DOCX processing
- **PDF-lib** for PDF manipulation
- **Natural** for NLP processing
- **Compromise.js** for text analysis

## 📁 Project Structure

```
resumeai/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── server.js        # Express server
│   └── package.json     # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── services/    # API services
│   │   └── App.tsx      # Main app component
│   └── package.json     # Frontend dependencies
└── package.json         # Root package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resumeai
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/resumeai
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=http://localhost:3000
   OPENAI_API_KEY=your-openai-api-key-here
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env file
   ```

5. **Run the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### File Upload
- `POST /api/upload/resume` - Upload resume file
- `POST /api/upload/job-description` - Upload job description

### AI Analysis
- `POST /api/ai/analyze` - Analyze resume against job description
- `POST /api/ai/optimize` - Generate optimized resume

### Resume Management
- `GET /api/resume` - Get all user resumes
- `GET /api/resume/:id` - Get specific resume
- `POST /api/resume` - Create new resume
- `PUT /api/resume/:id` - Update resume
- `DELETE /api/resume/:id` - Delete resume

## 🔧 Configuration

### OpenAI API Setup
1. Get your API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `.env` file as `OPENAI_API_KEY`

### MongoDB Setup
- **Local**: Install MongoDB and run `mongod`
- **Cloud**: Use MongoDB Atlas and update `MONGODB_URI`

### File Upload Limits
- Maximum file size: 10MB (configurable in `.env`)
- Supported formats: PDF, DOCX, DOC

## 🚀 Deployment

### Backend Deployment (AWS EC2)
1. Set up EC2 instance
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies
5. Set environment variables
6. Use PM2 for process management

### Frontend Deployment (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/build`
4. Add environment variables

### Database (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in environment variables

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Helmet.js for security headers
- CORS configuration
- File type validation
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- Resume templates
- Industry-specific optimization
- ATS compatibility scoring
- Resume comparison tools
- Export to multiple formats
- Advanced analytics dashboard


