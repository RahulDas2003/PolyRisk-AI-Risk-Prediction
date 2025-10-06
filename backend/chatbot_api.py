#!/usr/bin/env python3
"""
PolyRisk AI - Chatbot API for intelligent drug interaction assistance
Separate from patient_api.py as requested
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import google.generativeai as genai
import json

# ==========================================================
# ⚙️ Configuration
# ==========================================================
API_KEY = "AIzaSyCRfKwrBVo9aMj6mrXsRpvwPIkMCwd3Bpw"
genai.configure(api_key=API_KEY)

app = FastAPI(title="PolyRisk AI Chatbot API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# 📝 Data Models
# ==========================================================
class ChatMessage(BaseModel):
    message: str
    conversation_history: list = []

# ==========================================================
# 💬 Predefined Responses for Common Questions
# ==========================================================
PREDEFINED_RESPONSES = {
    "hello": "Hello! I'm PolyRisk AI Assistant. I can help you with:\n• Drug interaction information\n• Polypharmacy risks\n• How to use this platform\n• General healthcare guidance\n\nWhat would you like to know?",
    
    "what is polypharmacy": "Polypharmacy refers to the use of multiple medications by a patient, typically 5 or more drugs simultaneously. It's particularly common in elderly patients and can increase the risk of:\n• Drug-drug interactions\n• Adverse drug reactions\n• Medication errors\n• Reduced medication adherence\n\nOur platform helps identify and manage these risks.",
    
    "how to use": "To use PolyRisk AI:\n1. Sign up or log in to your account\n2. Go to the Dashboard\n3. Enter patient information (age, gender, kidney/liver function)\n4. Add medications with dosage and frequency\n5. Click 'Analyze Drug Interactions'\n6. Review the AI-generated risk report\n\nThe system will provide detailed analysis, alternatives, and monitoring recommendations.",
    
    "drug interactions": "Drug interactions occur when one medication affects how another drug works. Types include:\n• Drug-Drug Interactions: Between two medications\n• Drug-Food Interactions: Between drugs and food/beverages\n• Drug-Disease Interactions: When drugs worsen existing conditions\n\nOur AI analyzes all your medications to identify potential interactions and their severity levels.",
    
    "elderly patients": "Elderly patients face unique medication challenges:\n• Reduced kidney/liver function affects drug metabolism\n• Multiple chronic conditions require multiple medications\n• Increased sensitivity to drug side effects\n• Higher risk of adverse drug reactions\n\nOur platform specializes in analyzing polypharmacy risks for elderly patients (60+ years).",
    
    "risk levels": "We categorize risks into three levels:\n• Low Risk (0-3.0/10): Minimal concerns, routine monitoring\n• Moderate Risk (3.1-6.0/10): Some concerns, closer monitoring needed\n• High Risk (6.1-10.0/10): Significant concerns, immediate review recommended\n\nRisk scores consider age, organ function, drug interactions, and polypharmacy.",
    
    "alternatives": "Our AI provides drug alternatives when:\n• Current medications have high interaction risks\n• Safer options are available\n• Organ function requires dose adjustments\n\nEach alternative includes advantages, disadvantages, dosing recommendations, and monitoring parameters.",
    
    "monitoring": "Medication monitoring includes:\n• Regular lab tests (kidney, liver function)\n• Vital signs (blood pressure, heart rate)\n• Symptom tracking\n• Drug level monitoring when needed\n\nOur AI provides personalized monitoring recommendations based on your medication regimen.",
}

# ==========================================================
# 🤖 Chatbot Endpoints
# ==========================================================
@app.post("/api/chat")
async def chat_with_bot(chat_message: ChatMessage):
    """
    Intelligent chatbot endpoint with hybrid approach:
    - Predefined responses for common questions
    - Gemini AI for complex queries
    """
    try:
        user_message = chat_message.message.lower().strip()
        
        # Check for predefined responses first
        for keyword, response in PREDEFINED_RESPONSES.items():
            if keyword in user_message:
                return {
                    "status": "success",
                    "response": response,
                    "type": "predefined",
                    "timestamp": datetime.now().isoformat()
                }
        
        # If no predefined response, use Gemini AI
        context = """
        You are PolyRisk AI Assistant, a helpful medical AI chatbot specializing in:
        - Drug-drug interactions
        - Polypharmacy risks in elderly patients
        - Medication safety
        - Clinical decision support
        
        Guidelines:
        - Provide accurate, evidence-based information
        - Be empathetic and professional
        - Explain medical terms in simple language
        - Always recommend consulting healthcare professionals for medical decisions
        - If asked about specific drug combinations, provide general guidance but emphasize the need for professional consultation
        - Keep responses concise (2-3 paragraphs max)
        
        User question: {user_message}
        
        Provide a helpful, informative response.
        """
        
        # Build conversation context
        conversation_context = "\n".join([
            f"User: {msg.get('user', '')}\nAssistant: {msg.get('bot', '')}"
            for msg in chat_message.conversation_history[-3:]  # Last 3 exchanges
        ])
        
        full_prompt = f"{context}\n\nConversation history:\n{conversation_context}\n\nCurrent question: {chat_message.message}"
        
        # Call Gemini AI
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(full_prompt)
        
        return {
            "status": "success",
            "response": response.text.strip(),
            "type": "ai",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        # Fallback response
        return {
            "status": "success",
            "response": "I'm here to help! I can answer questions about drug interactions, polypharmacy risks, and how to use our platform. What would you like to know?",
            "type": "fallback",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

@app.get("/api/chat/suggestions")
async def get_suggestions():
    """Get suggested questions for users"""
    return {
        "status": "success",
        "suggestions": [
            "What is polypharmacy?",
            "How do I use this platform?",
            "Tell me about drug interactions",
            "What are the risk levels?",
            "How should elderly patients manage medications?",
            "What monitoring is recommended?",
            "Can you suggest drug alternatives?",
        ],
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/chat/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "PolyRisk AI Chatbot API",
        "timestamp": datetime.now().isoformat()
    }

# ==========================================================
# 🚀 Run Server
# ==========================================================
if __name__ == "__main__":
    import uvicorn
    print("Starting PolyRisk AI Chatbot API...")
    print("Chatbot API: http://localhost:8002")
    print("Chat Endpoint: POST /api/chat")
    print("Suggestions: GET /api/chat/suggestions")
    uvicorn.run("chatbot_api:app", host="0.0.0.0", port=8002, reload=True)
