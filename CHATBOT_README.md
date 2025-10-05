# 🤖 PolyRisk AI Chatbot Assistant

## Overview
An intelligent chatbot assistant integrated into the home page that helps users with drug interactions, polypharmacy risks, and platform guidance.

## Features

### 🎯 Hybrid Intelligence
- **Predefined Responses**: Fast answers to common questions
- **Gemini AI Integration**: Intelligent responses for complex queries
- **Context-Aware**: Remembers conversation history

### 💬 Capabilities
- Drug-drug interaction information
- Polypharmacy risk explanation
- Platform usage guidance
- Medication safety advice
- Elderly patient care recommendations
- Risk level explanations
- Drug alternatives suggestions
- Monitoring recommendations

### 🎨 UI Features
- Floating chat button with notification indicator
- Smooth animations and transitions
- Message history with timestamps
- AI response indicators
- Suggested questions
- Loading states
- Responsive design

## Architecture

### Backend API (`backend/chatbot_api.py`)
- **Port**: 8002
- **Framework**: FastAPI
- **AI Model**: Gemini 2.5 Flash
- **Endpoints**:
  - `POST /api/chat`: Send messages and get responses
  - `GET /api/chat/suggestions`: Get suggested questions
  - `GET /api/chat/health`: Health check

### Frontend Component (`src/components/ChatbotAssistant.tsx`)
- **Framework**: React + TypeScript
- **Animations**: Framer Motion
- **Styling**: TailwindCSS
- **Icons**: Lucide React

## Installation

### 1. Install Dependencies
```bash
# Python dependencies
pip install -r requirements.txt

# Frontend dependencies (already installed)
npm install
```

### 2. Start the Chatbot API
```bash
# Option 1: Using batch file
.\start_chatbot.bat

# Option 2: Manual start
cd backend
python chatbot_api.py
```

### 3. Start All Services
```bash
# Start all APIs at once
.\start_all_apis.bat

# This starts:
# - Main API (Port 8000)
# - Analytics API (Port 8001)
# - Chatbot API (Port 8002)
```

### 4. Start Frontend
```bash
npm start
```

## Usage

### For Users
1. Navigate to the home page
2. Click the floating chat button (bottom-right corner)
3. Ask questions or click suggested questions
4. Get instant AI-powered responses
5. Continue the conversation with context awareness

### Predefined Questions
- "What is polypharmacy?"
- "How do I use this platform?"
- "Tell me about drug interactions"
- "What are the risk levels?"
- "How should elderly patients manage medications?"
- "What monitoring is recommended?"
- "Can you suggest drug alternatives?"

### AI-Powered Queries
For complex questions not covered by predefined responses, the chatbot uses Gemini AI to provide:
- Evidence-based information
- Personalized guidance
- Medical term explanations
- Professional recommendations

## API Endpoints

### POST /api/chat
Send a message and get a response.

**Request Body:**
```json
{
  "message": "What is polypharmacy?",
  "conversation_history": [
    {
      "user": "Previous user message",
      "bot": "Previous bot response"
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "response": "Polypharmacy refers to...",
  "type": "predefined|ai|fallback",
  "timestamp": "2025-10-05T12:00:00"
}
```

### GET /api/chat/suggestions
Get suggested questions for users.

**Response:**
```json
{
  "status": "success",
  "suggestions": [
    "What is polypharmacy?",
    "How do I use this platform?",
    ...
  ],
  "timestamp": "2025-10-05T12:00:00"
}
```

## Customization

### Adding New Predefined Responses
Edit `backend/chatbot_api.py`:

```python
PREDEFINED_RESPONSES = {
    "your_keyword": "Your response here",
    ...
}
```

### Modifying AI Behavior
Update the context in `backend/chatbot_api.py`:

```python
context = """
Your custom instructions here...
"""
```

### Styling the Chatbot
Modify `src/components/ChatbotAssistant.tsx`:
- Colors: Update Tailwind classes
- Size: Adjust `w-96 h-[600px]`
- Position: Change `bottom-6 right-6`

## Technical Details

### Response Types
1. **Predefined**: Fast, keyword-based responses
2. **AI**: Gemini-powered intelligent responses
3. **Fallback**: Error handling responses

### Conversation Context
- Maintains last 3 message exchanges
- Provides context to AI for better responses
- Resets when chat window is closed

### Performance
- Predefined responses: <100ms
- AI responses: 1-3 seconds
- Fallback on API errors

## Security & Privacy
- No conversation data is stored permanently
- API key is securely configured
- CORS enabled for localhost only
- No sensitive patient data in chat logs

## Troubleshooting

### Chatbot API not starting
```bash
# Check if port 8002 is available
netstat -ano | findstr :8002

# Kill process if needed
taskkill /F /PID [PID_NUMBER]

# Restart the API
python backend/chatbot_api.py
```

### Frontend not connecting
1. Ensure chatbot API is running on port 8002
2. Check console for CORS errors
3. Verify API URL in `ChatbotAssistant.tsx`

### AI responses not working
1. Check Gemini API key in `chatbot_api.py`
2. Verify internet connection
3. Check API quota limits

## Future Enhancements
- [ ] Conversation history persistence
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Integration with patient data
- [ ] Advanced analytics
- [ ] Custom training on medical literature
- [ ] Sentiment analysis
- [ ] Proactive suggestions

## Support
For issues or questions:
- GitHub: https://github.com/RahulDas2003
- Email: rahuldassrm24@gmail.com

---

**Note**: This chatbot is for informational purposes only and should not replace professional medical advice. Always consult healthcare professionals for medical decisions.
