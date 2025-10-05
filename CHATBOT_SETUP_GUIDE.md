# 🚀 PolyRisk AI Chatbot - Quick Setup Guide

## ✅ What Was Created

### 1. Backend API (`backend/chatbot_api.py`)
- **Separate chatbot API** (doesn't touch `patient_api.py`)
- **Port**: 8002
- **Features**:
  - Hybrid intelligence (predefined + AI responses)
  - Gemini AI integration
  - Conversation history tracking
  - Suggested questions endpoint
  - Health check endpoint

### 2. Frontend Component (`src/components/ChatbotAssistant.tsx`)
- **Beautiful floating chat interface**
- **Features**:
  - Floating chat button with notification indicator
  - Smooth animations (Framer Motion)
  - Message history with timestamps
  - AI response indicators
  - Suggested questions
  - Loading states
  - Responsive design

### 3. Integration (`src/pages/Home.tsx`)
- Chatbot integrated into home page
- Appears as floating button in bottom-right corner
- Available to all users

### 4. Startup Scripts
- `start_chatbot.bat` - Start chatbot API only
- `start_all_apis.bat` - Start all APIs (Main + Analytics + Chatbot)

### 5. Documentation
- `CHATBOT_README.md` - Comprehensive documentation
- `CHATBOT_SETUP_GUIDE.md` - This file

## 🎯 How to Start Everything

### Option 1: Start All APIs at Once (Recommended)
```bash
.\start_all_apis.bat
```
This will start:
- Main API (Port 8000)
- Analytics API (Port 8001)
- Chatbot API (Port 8002)

### Option 2: Start APIs Individually

**Terminal 1 - Main API:**
```bash
cd backend
python patient_api.py
```

**Terminal 2 - Analytics API:**
```bash
cd backend
python analytics_api.py
```

**Terminal 3 - Chatbot API:**
```bash
cd backend
python chatbot_api.py
```

**Terminal 4 - Frontend:**
```bash
npm start
```

## 📋 Verification Checklist

### 1. Check All APIs Are Running
```bash
# Main API
curl http://localhost:8000/api/health

# Analytics API
curl http://localhost:8001/api/health

# Chatbot API
curl http://localhost:8002/api/chat/health
```

### 2. Check Frontend
- Open browser: `http://localhost:3000`
- Navigate to home page
- Look for floating chat button (bottom-right corner)
- Click button to open chat

### 3. Test Chatbot
- Click the floating chat button
- Try a predefined question: "What is polypharmacy?"
- Try an AI question: "How do drug interactions affect elderly patients?"
- Check for smooth animations and responses

## 🎨 Chatbot Features

### Predefined Responses (Fast)
- "What is polypharmacy?"
- "How do I use this platform?"
- "Tell me about drug interactions"
- "What are the risk levels?"
- "How should elderly patients manage medications?"
- "What monitoring is recommended?"
- "Can you suggest drug alternatives?"

### AI-Powered Responses (Intelligent)
- Complex medical questions
- Specific drug combinations
- Personalized guidance
- Evidence-based information

### UI Features
- ✅ Floating chat button with pulse animation
- ✅ Smooth slide-in/out animations
- ✅ Message bubbles (user vs bot)
- ✅ Timestamps on messages
- ✅ AI response indicators
- ✅ Loading spinner while thinking
- ✅ Suggested questions for new users
- ✅ Conversation history
- ✅ Responsive design

## 🔧 Troubleshooting

### Chatbot Button Not Appearing
1. Check if frontend is running: `http://localhost:3000`
2. Check browser console for errors
3. Verify `ChatbotAssistant` is imported in `Home.tsx`

### Chatbot Not Responding
1. Check if chatbot API is running on port 8002
2. Open browser console and check for network errors
3. Verify API URL in `ChatbotAssistant.tsx` is correct

### Port Already in Use
```bash
# Check what's using port 8002
netstat -ano | findstr :8002

# Kill the process
taskkill /F /PID [PID_NUMBER]

# Restart chatbot API
cd backend
python chatbot_api.py
```

### AI Responses Not Working
1. Check Gemini API key in `backend/chatbot_api.py`
2. Verify internet connection
3. Check API quota limits
4. Fallback responses will still work

## 📊 API Endpoints

### Chatbot API (Port 8002)

#### POST /api/chat
Send a message and get a response.

```bash
curl -X POST http://localhost:8002/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is polypharmacy?",
    "conversation_history": []
  }'
```

#### GET /api/chat/suggestions
Get suggested questions.

```bash
curl http://localhost:8002/api/chat/suggestions
```

#### GET /api/chat/health
Health check.

```bash
curl http://localhost:8002/api/chat/health
```

## 🎯 Next Steps

### 1. Start All Services
```bash
# Start all APIs
.\start_all_apis.bat

# In a new terminal, start frontend
npm start
```

### 2. Test the Chatbot
- Open `http://localhost:3000`
- Click the floating chat button
- Ask questions and verify responses

### 3. Customize (Optional)
- Add more predefined responses in `backend/chatbot_api.py`
- Modify chatbot styling in `src/components/ChatbotAssistant.tsx`
- Adjust AI behavior in the Gemini prompt

## 📝 Important Notes

1. **`patient_api.py` was NOT modified** - Chatbot is completely separate
2. **Port 8002** is used for chatbot API
3. **Gemini AI** is used for intelligent responses
4. **Hybrid approach** - Fast predefined + Smart AI responses
5. **No data persistence** - Conversations reset on page reload

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ All 3 APIs are running (8000, 8001, 8002)
- ✅ Frontend loads at `http://localhost:3000`
- ✅ Floating chat button appears on home page
- ✅ Chat window opens smoothly when clicked
- ✅ Bot responds to messages
- ✅ AI indicator shows for complex queries
- ✅ Suggested questions appear for new users

## 📞 Support

If you encounter issues:
1. Check all APIs are running
2. Check browser console for errors
3. Verify port availability
4. Review API logs in terminal windows

---

**Ready to test?** Run `.\start_all_apis.bat` and then `npm start`! 🚀
