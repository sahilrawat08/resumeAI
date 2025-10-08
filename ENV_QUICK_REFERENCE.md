# 🔐 Environment Variables - Quick Reference Card

## Backend `.env` File Location
`/Users/sahilrawat/Developer/projects/resumeai/backend/.env`

---

## ✅ REQUIRED Variables (Must Have)

| Variable | Where to Get | Example |
|----------|-------------|---------|
| `MONGODB_URI` | [MongoDB Atlas](https://cloud.mongodb.com/) or Local | `mongodb+srv://user:pass@cluster.mongodb.net/resumeai` |
| `JWT_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` | `a1b2c3d4e5f6...` (64+ chars) |
| `OPENAI_API_KEY` | [OpenAI Platform](https://platform.openai.com/api-keys) | `sk-proj-xxxxx...` |

---

## ⚙️ OPTIONAL Variables (Recommended)

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `5000` | Backend server port |
| `NODE_ENV` | `development` | Environment mode |
| `FRONTEND_URL` | `http://localhost:3000` | For CORS |
| `GOOGLE_CLIENT_ID` | - | Google OAuth (optional) |

---

## 📝 Template

Copy this to your `backend/.env`:

```env
# ===== REQUIRED =====
MONGODB_URI=mongodb://localhost:27017/resumeai
JWT_SECRET=GENERATE_A_RANDOM_64_CHAR_STRING
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE

# ===== RECOMMENDED =====
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# ===== OPTIONAL =====
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

---

## 🎯 Frontend `.env` File Location
`/Users/sahilrawat/Developer/projects/resumeai/frontend/.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ⚡ Quick Setup Commands

```bash
# Navigate to project
cd /Users/sahilrawat/Developer/projects/resumeai

# Create backend .env from template
cp backend/env.example backend/.env

# Create frontend .env
echo "REACT_APP_API_URL=http://localhost:5000/api" > frontend/.env

# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Test MongoDB connection
mongosh "YOUR_MONGODB_URI"
```

---

## 🔗 Quick Links

- **MongoDB Atlas**: https://cloud.mongodb.com/
- **OpenAI API Keys**: https://platform.openai.com/api-keys
- **Google OAuth**: https://console.cloud.google.com/apis/credentials
- **Full Setup Guide**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## ⚠️ IMPORTANT Security Notes

1. ❌ **NEVER** commit `.env` files to Git
2. ✅ Use different secrets for dev/production
3. ✅ Keep OpenAI API key private
4. ✅ Use strong, random JWT_SECRET (64+ characters)
5. ✅ Whitelist IPs in MongoDB Atlas

---

## 🆘 Common Issues

**Problem**: "Cannot connect to MongoDB"
- ✅ Check MONGODB_URI is correct
- ✅ Whitelist your IP in MongoDB Atlas
- ✅ Verify MongoDB is running (if local)

**Problem**: "OpenAI API Error"
- ✅ Check API key is valid
- ✅ Verify you have credits remaining
- ✅ No extra spaces in the key

**Problem**: "JWT Error"
- ✅ Ensure JWT_SECRET is set
- ✅ Use a strong random string
- ✅ Check for typos

---

## ✨ Ready to Start?

1. Set all required environment variables
2. Run: `npm run install-all`
3. Run: `npm run dev`
4. Visit: http://localhost:3000

**Need detailed instructions?** See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

