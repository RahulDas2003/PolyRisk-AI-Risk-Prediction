module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Chatbot API is running',
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversation_id } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Predefined responses for common queries
    const predefinedResponses = {
      "hello": "Hello! I'm your AI assistant for polypharmacy risk assessment. How can I help you today?",
      "help": "I can help you with:\n• Understanding drug interactions\n• Explaining risk factors\n• Providing medication guidance\n• Answering questions about polypharmacy\n\nWhat would you like to know?",
      "drug interaction": "Drug interactions occur when medications affect each other's effectiveness or cause adverse effects. Common types include:\n• Pharmacokinetic interactions (absorption, metabolism)\n• Pharmacodynamic interactions (effects on body systems)\n• Physical/chemical incompatibilities\n\nWould you like me to analyze specific medications?",
      "risk factors": "Key risk factors for polypharmacy include:\n• Age (especially 65+)\n• Multiple chronic conditions\n• Kidney/liver function impairment\n• Number of medications (5+ increases risk)\n• Drug-drug interactions\n• Patient adherence issues\n\nWould you like to assess your specific risk factors?",
      "medication safety": "Medication safety tips:\n• Keep an updated medication list\n• Review medications regularly with healthcare provider\n• Understand each medication's purpose\n• Report any new symptoms immediately\n• Use one pharmacy when possible\n• Ask about potential interactions\n\nDo you have specific medication concerns?"
    };

    // Check for predefined responses
    const lowerMessage = message.toLowerCase();
    let response = null;

    for (const [key, value] of Object.entries(predefinedResponses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }

    // If no predefined response, generate a generic helpful response
    if (!response) {
      response = `I understand you're asking about "${message}". As your polypharmacy risk assessment assistant, I can help you with:\n\n• Drug interaction analysis\n• Risk factor assessment\n• Medication safety guidance\n• Polypharmacy management\n\nCould you be more specific about what you'd like to know?`;
    }

    return res.status(200).json({
      success: true,
      response,
      conversation_id: conversation_id || `conv_${Date.now()}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in chatbot:', error);
    return res.status(500).json({
      error: 'Failed to process message'
    });
  }
};
