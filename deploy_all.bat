@echo off
echo 🚀 Deploying PolyRisk AI - Full Stack Application
echo.

echo 📦 Step 1: Deploying Frontend to Vercel...
call vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Frontend deployment failed
    pause
    exit /b 1
)
echo ✅ Frontend deployed successfully!

echo.
echo 🔧 Step 2: Deploying Backend APIs to Railway...
echo.
echo 📋 Please follow these steps:
echo 1. Install Railway CLI: npm install -g @railway/cli
echo 2. Login to Railway: railway login
echo 3. Deploy Main API: railway up --service main-api
echo 4. Deploy Analytics API: railway up --service analytics-api
echo 5. Deploy Chatbot API: railway up --service chatbot-api
echo.
echo 📖 For detailed instructions, see: RAILWAY_DEPLOYMENT_GUIDE.md
echo.

echo 🎉 Deployment process completed!
echo.
echo 🌐 Your application will be available at:
echo    Frontend: https://polyrisk-ai.vercel.app
echo    Backend: https://your-railway-urls.railway.app
echo.
pause
