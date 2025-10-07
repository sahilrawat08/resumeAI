#!/bin/bash

# ResumeAI Deployment Script
echo "🚀 Starting ResumeAI deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check environment variables
echo "🔧 Checking environment configuration..."

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Environment file not found. Creating from template..."
    cp backend/env.example backend/.env
    echo "📝 Please edit backend/.env with your configuration:"
    echo "   - MONGODB_URI"
    echo "   - JWT_SECRET"
    echo "   - OPENAI_API_KEY"
    echo "   - FRONTEND_URL"
    echo ""
    echo "After editing, run this script again."
    exit 1
fi

# Build frontend
echo "🏗️  Building frontend..."
cd frontend
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

cd ..

# Run tests
echo "🧪 Running tests..."
npm run test:all

if [ $? -ne 0 ]; then
    echo "⚠️  Some tests failed, but continuing with deployment..."
fi

# Start the application
echo "🎉 Deployment completed successfully!"
echo ""
echo "To start the application:"
echo "  Development: npm run dev"
echo "  Production:  npm start"
echo ""
echo "Access the application at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""
echo "Happy coding! 🚀"
