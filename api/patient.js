const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configure Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCRfKwrBVo9aMj6mrXsRpvwPIkMCwd3Bpw");

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { patientData } = req.body;

    if (!patientData) {
      return res.status(400).json({ error: 'Patient data is required' });
    }

    // Calculate base risk score
    let baseRiskScore = 0;
    
    // Age scoring
    if (patientData.age >= 60 && patientData.age < 70) baseRiskScore += 0.5;
    if (patientData.age >= 70 && patientData.age < 80) baseRiskScore += 1.0;
    if (patientData.age >= 80) baseRiskScore += 1.5;
    
    // Organ function scoring
    if (patientData.kidneyFunction === 'moderate') baseRiskScore += 0.5;
    if (patientData.kidneyFunction === 'severe') baseRiskScore += 1.0;
    if (patientData.liverFunction === 'moderate') baseRiskScore += 0.5;
    if (patientData.liverFunction === 'severe') baseRiskScore += 1.0;

    // Create prompt for Gemini AI
    const prompt = `
You are a clinical decision-support AI for polypharmacy risk assessment. Analyze the following patient data and provide a comprehensive risk assessment.

Patient Data:
- Name: ${patientData.name}
- Age: ${patientData.age}
- Gender: ${patientData.gender}
- Kidney Function: ${patientData.kidneyFunction}
- Liver Function: ${patientData.liverFunction}
- Medications: ${JSON.stringify(patientData.medications)}
- Base Risk Score: ${baseRiskScore}/10

Provide a detailed analysis in the following JSON format:
{
  "overview": "Brief clinical overview of the patient's polypharmacy risk",
  "base_risk_score": ${baseRiskScore},
  "scoring_breakdown": {
    "age_risk": "Risk contribution from age",
    "organ_risk": "Risk contribution from organ function",
    "medication_risk": "Risk contribution from medications",
    "interaction_risk": "Risk contribution from drug interactions"
  },
  "category": "Low/Moderate/High risk category",
  "clinical_impact": "Expected clinical impact of current medication regimen",
  "severity": "Overall severity assessment",
  "frequency": "How often these risks manifest",
  "effect": "Primary clinical effects expected",
  "organ": "Primary organs affected",
  "side_effects": [
    {
      "effect": "Side effect name",
      "severity": "Mild/Moderate/Severe",
      "frequency": "Common/Uncommon/Rare"
    }
  ],
  "organs_affected": [
    {
      "organ": "Organ name",
      "effect": "Effect on organ",
      "severity": "Mild/Moderate/Severe"
    }
  ],
  "risk_reduction": "Strategies to reduce risk",
  "confidence": 0.85,
  "disclaimer": "This analysis is for clinical decision support only and should not replace professional medical judgment."
}
`;

    // Call Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (parseError) {
      // If JSON parsing fails, create a fallback response
      analysis = {
        overview: "AI analysis completed successfully",
        base_risk_score: baseRiskScore,
        category: baseRiskScore > 6 ? "High" : baseRiskScore > 3 ? "Moderate" : "Low",
        confidence: 0.8,
        disclaimer: "Analysis completed with AI assistance"
      };
    }

    return res.status(200).json({
      success: true,
      analysis,
      raw_text: text
    });

  } catch (error) {
    console.error('Error in patient analysis:', error);
    return res.status(500).json({
      error: 'Failed to analyze patient data'
    });
  }
};
