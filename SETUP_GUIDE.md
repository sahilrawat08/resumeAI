# 🔐 ResumeAI Setup Guide - Environment Variables & Configuration

This guide will help you set up all the confidential information needed to run ResumeAI.

## 📋 Required Configuration

### 1. Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp env.example .env
```

Then edit `backend/.env` with your actual values:

```env
# ==============================================
# DATABASE CONFIGURATION
# ==============================================

# MongoDB Connection String
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/resumeai

# Option 2: MongoDB Atlas (Recommended for Production)
# Get this from: https://cloud.mongodb.com/
# Example: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resumeai?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/resumeai

# ==============================================
# AUTHENTICATION & SECURITY
# ==============================================

# JWT Secret Key (IMPORTANT: Use a strong random string)
# Generate one using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-here-change-this-to-something-random-and-secure

# ==============================================
# AI/NLP CONFIGURATION
# ==============================================

# OpenAI API Key (Required for AI resume analysis)
# Get this from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ==============================================
# GOOGLE OAUTH (Optional - for Google Sign-In)
# ==============================================

# Google OAuth Client ID
# Get this from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com

# ==============================================
# SERVER CONFIGURATION
# ==============================================

# Port for backend server
PORT=5000

# Node Environment
NODE_ENV=development

# ==============================================
# CORS CONFIGURATION
# ==============================================

# Frontend URL (for CORS)
# Local Development:
FRONTEND_URL=http://localhost:3000

# Production (update when deployed):
# FRONTEND_URL=https://your-frontend-domain.vercel.app
```

---

### 2. Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
cd frontend
touch .env
```

Then add:

```env
# ==============================================
# API CONFIGURATION
# ==============================================

# Backend API URL
# Local Development:
REACT_APP_API_URL=http://localhost:5000/api

# Production (update when deployed):
# REACT_APP_API_URL=https://your-backend-domain.vercel.app/api

# ==============================================
# GOOGLE OAUTH (Optional)
# ==============================================

# Google OAuth Client ID (same as backend)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

---

## 🔑 How to Get Each Credential

### 1. MongoDB URI (Database)

**Option A: Local MongoDB**
```env
MONGODB_URI=mongodb://localhost:27017/resumeai
```
- Install MongoDB locally: https://www.mongodb.com/docs/manual/installation/
- No credentials needed for local development

**Option B: MongoDB Atlas (Recommended)**
1. Go to https://cloud.mongodb.com/
2. Create a free account
3. Create a new cluster (M0 Free Tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `myFirstDatabase` with `resumeai`

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resumeai?retryWrites=true&w=majority
```

---

### 2. JWT Secret Key (Authentication)

**Generate a secure random key:**

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 64

# Option 3: Use any random string generator
# Example: https://randomkeygen.com/
```

Copy the output and use it as your `JWT_SECRET`:

```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6...
```

**⚠️ IMPORTANT:** 
- Keep this secret and never commit it to Git
- Use a different secret for development and production
- Never share this key publicly

---

### 3. OpenAI API Key (AI Analysis)

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. **⚠️ Save it immediately - you won't see it again!**

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**💰 Pricing:**
- New accounts get $5 free credit
- Pay-as-you-go after free credit
- GPT-3.5-turbo is very affordable (~$0.002 per analysis)
- Monitor usage: https://platform.openai.com/usage

---

### 4. Google OAuth Client ID (Optional - for Google Sign-In)

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable "Google+ API" or "Google Identity"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen if needed
6. Application type: "Web application"
7. Add Authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://your-production-domain.com` (production)
8. Add Authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `https://your-production-domain.com` (production)
9. Copy the "Client ID"

```env
GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

**Note:** Google OAuth is optional. The app works fine with email/password authentication.

---

## 🚀 Quick Setup Script

Run this script to quickly set up your environment:

```bash
#!/bin/bash

# Navigate to project root
cd /Users/sahilrawat/Developer/projects/resumeai

# Backend setup
cd backend
cp env.example .env
echo "✅ Created backend/.env file"
echo "⚠️  Please edit backend/.env with your actual credentials"

# Frontend setup
cd ../frontend
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF
echo "✅ Created frontend/.env file"

cd ..
echo "✨ Setup complete! Now edit the .env files with your credentials."
```

---

## ✅ Verification Checklist

Before running the application, make sure you have:

### Backend (`backend/.env`):
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Strong random secret key
- [ ] `OPENAI_API_KEY` - OpenAI API key
- [ ] `PORT` - Set to 5000 (or your preference)
- [ ] `NODE_ENV` - Set to development
- [ ] `FRONTEND_URL` - Set to http://localhost:3000

### Frontend (`frontend/.env`):
- [ ] `REACT_APP_API_URL` - Set to http://localhost:5000/api

### Optional:
- [ ] `GOOGLE_CLIENT_ID` - For Google OAuth (in both backend and frontend)

---

## 🔒 Security Best Practices

1. **Never commit `.env` files to Git**
   - Already added to `.gitignore`
   - Double-check before pushing

2. **Use different secrets for development and production**
   - Development: Can be simpler
   - Production: Must be very strong and unique

3. **Rotate secrets regularly**
   - Change JWT_SECRET periodically
   - Regenerate API keys if compromised

4. **Limit API key permissions**
   - OpenAI: Set usage limits
   - MongoDB: Use specific user permissions
   - Google OAuth: Restrict to specific domains

5. **Monitor usage and access**
   - Check OpenAI usage dashboard
   - Monitor MongoDB Atlas metrics
   - Review Google OAuth logs

---

## 🆘 Troubleshooting

### "Cannot connect to MongoDB"
- Check if MongoDB is running locally
- Verify MongoDB Atlas connection string
- Check firewall/network settings
- Whitelist your IP in MongoDB Atlas

### "OpenAI API Error"
- Verify API key is correct
- Check if you have remaining credits
- Ensure no extra spaces in the key

### "CORS Error"
- Verify FRONTEND_URL matches your frontend URL
- Check if both servers are running
- Clear browser cache

### "JWT Error"
- Ensure JWT_SECRET is set
- Check if secret is the same across restarts
- Clear cookies and tokens

---

## 📚 Additional Resources

- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **OpenAI API**: https://platform.openai.com/docs
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
- **Environment Variables**: https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs

---

## 💡 Pro Tips

1. **Use MongoDB Compass** for easier database management
   - Download: https://www.mongodb.com/products/compass

2. **Test OpenAI API** before full integration
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

3. **Generate strong passwords** for MongoDB users
   - Use a password manager
   - Minimum 16 characters with mix of types

4. **Set up environment-specific configs**
   - `.env.development`
   - `.env.production`
   - `.env.test`

---

## 🎯 Ready to Run?

Once all environment variables are set:

```bash
# Install dependencies
npm run install-all

# Start both servers
npm run dev

# Or start separately:
# Backend: cd backend && npm run dev
# Frontend: cd frontend && npm start
```

Access your application at: **http://localhost:3000**

---

**Need help?** Create an issue at: https://github.com/sahilrawat08/resumeAI/issues

