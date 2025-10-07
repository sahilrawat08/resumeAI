# Deployment Guide for ResumeAI

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)

#### Backend Deployment
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add OPENAI_API_KEY
   vercel env add FRONTEND_URL
   ```

#### Frontend Deployment
1. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

2. **Set Environment Variables**
   ```bash
   vercel env add REACT_APP_API_URL
   ```

### Option 2: Netlify + Railway

#### Backend (Railway)
1. Connect GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically

#### Frontend (Netlify)
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Set environment variables

### Option 3: Heroku

#### Backend
```bash
cd backend
heroku create resumeai-backend
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set OPENAI_API_KEY=your-openai-key
heroku config:set FRONTEND_URL=https://your-frontend-url.com
git push heroku main
```

#### Frontend
```bash
cd frontend
heroku create resumeai-frontend
heroku config:set REACT_APP_API_URL=https://resumeai-backend.herokuapp.com/api
git push heroku main
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resumeai
JWT_SECRET=your-super-secret-jwt-key-here
OPENAI_API_KEY=your-openai-api-key-here
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## 📋 Pre-Deployment Checklist

- [ ] MongoDB database set up (local or Atlas)
- [ ] OpenAI API key obtained
- [ ] Environment variables configured
- [ ] CORS settings updated for production domains
- [ ] File upload limits configured
- [ ] Rate limiting configured
- [ ] Security headers enabled
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Health check endpoint working

## 🧪 Testing Deployment

1. **Health Check**
   ```bash
   curl https://your-backend-domain.com/api/health
   ```

2. **Test Authentication**
   ```bash
   curl -X POST https://your-backend-domain.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'
   ```

3. **Test File Upload**
   ```bash
   curl -X POST https://your-backend-domain.com/api/upload \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "resume=@test-resume.pdf"
   ```

## 🔍 Monitoring

### Backend Monitoring
- Set up logging with Winston or similar
- Monitor API response times
- Track error rates
- Monitor database connections

### Frontend Monitoring
- Set up error tracking (Sentry)
- Monitor Core Web Vitals
- Track user interactions
- Monitor bundle size

## 🚨 Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Verify no trailing spaces

3. **CORS Issues**
   - Update FRONTEND_URL in backend
   - Check CORS configuration
   - Verify domain names match

4. **Database Connection**
   - Check MongoDB URI format
   - Verify network access
   - Check authentication credentials

## 📊 Performance Optimization

### Backend
- Enable gzip compression
- Set up Redis caching
- Optimize database queries
- Implement connection pooling

### Frontend
- Enable code splitting
- Optimize bundle size
- Implement lazy loading
- Use CDN for static assets

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Secure headers configured
- [ ] API keys secured
- [ ] Database access restricted
