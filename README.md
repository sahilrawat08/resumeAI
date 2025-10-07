# ResumeAI 🚀

[![GitHub stars](https://img.shields.io/github/stars/sahilrawat08/resumeAI?style=social)](https://github.com/sahilrawat08/resumeAI)
[![GitHub forks](https://img.shields.io/github/forks/sahilrawat08/resumeAI?style=social)](https://github.com/sahilrawat08/resumeAI)
[![GitHub issues](https://img.shields.io/github/issues/sahilrawat08/resumeAI)](https://github.com/sahilrawat08/resumeAI/issues)
[![GitHub license](https://img.shields.io/github/license/sahilrawat08/resumeAI)](https://github.com/sahilrawat08/resumeAI/blob/main/LICENSE)

> **AI-Powered Resume Optimization Platform** - Transform your resume with cutting-edge NLP technology and modern dark-themed UI

## 🌟 Features

### 🎨 **Modern Dark Theme UI**
- **Glassmorphism Design** - Beautiful translucent cards with backdrop blur
- **Smooth Animations** - Framer Motion powered transitions
- **Responsive Layout** - Mobile-first design with collapsible sidebar
- **Dark Color Palette** - Professional `#0a0a0a` background with `#4f9dff` accents

### 🤖 **AI-Powered Analysis**
- **ATS Compatibility Scoring** - Get 0-100% ATS compatibility scores
- **Keyword Matching** - Advanced NLP keyword extraction and matching
- **Skill Gap Analysis** - Identify missing skills and competencies
- **Personalized Suggestions** - AI-generated improvement recommendations

### 📊 **Interactive Analytics**
- **Real-time Charts** - Dark-themed Recharts visualizations
- **Performance Metrics** - Track your resume optimization progress
- **Export Reports** - Download detailed analysis reports
- **Historical Data** - View past analyses and improvements

### 🔐 **Authentication & Security**
- **JWT Authentication** - Secure token-based authentication
- **User Management** - Profile management and settings
- **Data Privacy** - Secure data handling and storage
- **CORS Configuration** - Production-ready CORS setup

## 🛠️ Tech Stack

### **Frontend**
- **React.js 18** with TypeScript
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications

### **Backend**
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **OpenAI API** for NLP processing
- **CORS** for cross-origin requests

### **Deployment**
- **Vercel** ready configuration
- **MongoDB Atlas** support
- **Environment variables** management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sahilrawat08/resumeAI.git
   cd resumeAI
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   
   # Update backend/.env with your values:
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start Development Servers**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
resumeAI/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── index.css       # Global styles
│   ├── public/             # Static assets
│   └── package.json
├── backend/                # Node.js backend
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   ├── middleware/         # Custom middleware
│   ├── server.js          # Main server file
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Resume Analysis
- `POST /api/analyze` - Analyze resume
- `GET /api/analyze` - Get user analyses
- `GET /api/analyze/:id` - Get specific analysis
- `GET /api/analyze/export/:id` - Export analysis report

### File Upload
- `POST /api/upload` - Upload resume file

## 🎯 ATS Scoring Algorithm

The ATS compatibility score is calculated using a weighted formula:

```javascript
ATS_Score = (keywordMatch * 0.5) + (skillMatch * 0.3) + (actionVerbCount * 0.2)
```

- **Keyword Match (50%)** - Relevance of keywords from job description
- **Skill Match (30%)** - Matching technical and soft skills
- **Action Verb Count (20%)** - Presence of strong action verbs

## 🚀 Deployment

### Vercel Deployment

1. **Backend Deployment**
   ```bash
   cd backend
   vercel --prod
   ```

2. **Frontend Deployment**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Environment Variables**
   - Set production environment variables in Vercel dashboard
   - Update `FRONTEND_URL` to your production frontend URL

### MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update `MONGODB_URI` in environment variables

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sahil Rawat**
- GitHub: [@sahilrawat08](https://github.com/sahilrawat08)
- LinkedIn: [Sahil Rawat](https://linkedin.com/in/sahilrawat08)

## 🙏 Acknowledgments

- OpenAI for providing the NLP API
- React team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- Framer Motion for smooth animations
- Recharts for beautiful data visualizations

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/sahilrawat08/resumeAI/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the maintainer

---

⭐ **Star this repository if you found it helpful!**