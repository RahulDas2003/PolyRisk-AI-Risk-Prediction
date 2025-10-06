# 🚀 Railway Backend Deployment Guide

This guide will help you deploy your backend APIs to Railway platform.

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Railway CLI**: Install with `npm install -g @railway/cli`
3. **GitHub Repository**: Your code should be on GitHub

## 🚀 Step-by-Step Deployment

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```

### Step 3: Deploy Main API (patient_api.py)
```bash
# Navigate to your project directory
cd "C:\Users\rd773\Desktop\PolyRisk AI Risk Prediction"

# Initialize Railway project
railway init

# Deploy Main API
railway up --service main-api
```

### Step 4: Deploy Analytics API (analytics_api.py)
```bash
# Create a new service for Analytics API
railway service create analytics-api
railway up --service analytics-api
```

### Step 5: Deploy Chatbot API (chatbot_api.py)
```bash
# Create a new service for Chatbot API
railway service create chatbot-api
railway up --service chatbot-api
```

## 🔧 Environment Variables

Set these environment variables in Railway dashboard:

### Main API (patient_api.py)
- `GEMINI_API_KEY`: `AIzaSyCRfKwrBVo9aMj6mrXsRpvwPIkMCwd3Bpw`
- `SUPABASE_URL`: `https://jahlgqavwdxvwrjwlpem.supabase.co`
- `SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphaGxncWF2d2R4dndyandscGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTI1MDEsImV4cCI6MjA3NTA4ODUwMX0.ve38C86UQAgFHH8pASLneWWw4atx_-npVf9orNNFic`
- `ALLOWED_ORIGINS`: `https://polyrisk-ai.vercel.app,https://polyrisk-nd8qrnts3-rahul-das-projects-fd592480.vercel.app`

### Analytics API (analytics_api.py)
- `ALLOWED_ORIGINS`: `https://polyrisk-ai.vercel.app,https://polyrisk-nd8qrnts3-rahul-das-projects-fd592480.vercel.app`

### Chatbot API (chatbot_api.py)
- `ALLOWED_ORIGINS`: `https://polyrisk-ai.vercel.app,https://polyrisk-nd8qrnts3-rahul-das-projects-fd592480.vercel.app`

## 🌐 Update Frontend Environment Variables

After deploying to Railway, update your Vercel environment variables:

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add these variables**:
   - `REACT_APP_MAIN_API_URL` = `https://your-main-api.railway.app`
   - `REACT_APP_ANALYTICS_API_URL` = `https://your-analytics-api.railway.app`
   - `REACT_APP_CHATBOT_API_URL` = `https://your-chatbot-api.railway.app`

## 🔍 Testing Your Deployment

### Test Main API
```bash
curl https://your-main-api.railway.app/api/health
```

### Test Analytics API
```bash
curl https://your-analytics-api.railway.app/api/health
```

### Test Chatbot API
```bash
curl https://your-chatbot-api.railway.app/api/health
```

## 📊 Expected Results

After successful deployment:
- ✅ **Main API**: Handles patient data and AI analysis
- ✅ **Analytics API**: Provides dashboard metrics
- ✅ **Chatbot API**: Powers the chatbot assistant
- ✅ **Frontend**: Connected to all backend services
- ✅ **Full-Stack**: Complete application working

## 🚨 Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure `ALLOWED_ORIGINS` includes your Vercel URL
2. **API Not Found**: Check that services are running on Railway
3. **Environment Variables**: Verify all required variables are set

### Debug Commands:
```bash
# Check service status
railway status

# View logs
railway logs

# Connect to service
railway connect
```

## 🎉 Success!

Once deployed, your PolyRisk AI application will be fully functional with:
- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Railway
- **Database**: Supabase integration
- **AI**: Gemini AI integration
- **Analytics**: Live dashboard metrics
- **Chatbot**: AI-powered assistant

Your application will be live at: `https://polyrisk-ai.vercel.app`
