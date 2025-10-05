// Patient Data JSON Extractor
// Automatically extracts structured JSON from PatientForm data

export interface ExtractedPatientData {
  patient_name: string;
  age: number;
  gender: string;
  kidney_function: string;
  liver_function: string;
  medications: Array<{
    name: string;
    dose: string;
    frequency: string;
    category: string;
  }>;
  polypharmacy_risk: boolean;
  medication_count: number;
  timestamp: string;
  risk_factors: string[];
  clinical_notes: string;
}

export interface RealTimeAnalysis {
  extracted_data: ExtractedPatientData;
  risk_indicators: string[];
  clinical_alerts: string[];
  monitoring_suggestions: string[];
  confidence_score: number;
}

// Extract structured JSON from patient form data
export function extractPatientDataJSON(patientData: {
  name: string;
  age: number;
  gender: string;
  kidneyFunction: string;
  liverFunction: string;
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    category: string;
  }>;
}): ExtractedPatientData {
  const isPolypharmacy = patientData.medications.length >= 5;
  const riskFactors: string[] = [];
  
  // Identify risk factors
  if (patientData.age >= 65) {
    riskFactors.push('Elderly patient (65+)');
  }
  if (patientData.age >= 75) {
    riskFactors.push('Advanced age (75+)');
  }
  if (patientData.kidneyFunction !== 'normal') {
    riskFactors.push(`Kidney impairment: ${patientData.kidneyFunction}`);
  }
  if (patientData.liverFunction !== 'normal') {
    riskFactors.push(`Liver impairment: ${patientData.liverFunction}`);
  }
  if (isPolypharmacy) {
    riskFactors.push(`Polypharmacy: ${patientData.medications.length} medications`);
  }
  
  // Generate clinical notes
  const clinicalNotes = generateClinicalNotes(patientData, riskFactors);
  
  return {
    patient_name: patientData.name,
    age: patientData.age,
    gender: patientData.gender,
    kidney_function: patientData.kidneyFunction,
    liver_function: patientData.liverFunction,
    medications: patientData.medications.map(med => ({
      name: med.name,
      dose: med.dosage,
      frequency: med.frequency,
      category: med.category
    })),
    polypharmacy_risk: isPolypharmacy,
    medication_count: patientData.medications.length,
    timestamp: new Date().toISOString(),
    risk_factors: riskFactors,
    clinical_notes: clinicalNotes
  };
}

// Generate clinical notes based on patient data
function generateClinicalNotes(patientData: any, riskFactors: string[]): string {
  let notes = `Patient: ${patientData.name}, ${patientData.age} years old, ${patientData.gender}`;
  
  if (riskFactors.length > 0) {
    notes += `. Risk factors: ${riskFactors.join(', ')}`;
  }
  
  if (patientData.medications.length > 0) {
    const medicationNames = patientData.medications.map((med: any) => med.name).join(', ');
    notes += `. Current medications: ${medicationNames}`;
  }
  
  return notes;
}

// Perform real-time analysis on extracted data
export function performRealTimeAnalysis(extractedData: ExtractedPatientData): RealTimeAnalysis {
  const riskIndicators: string[] = [];
  const clinicalAlerts: string[] = [];
  const monitoringSuggestions: string[] = [];
  
  // Analyze risk indicators
  if (extractedData.age >= 75) {
    riskIndicators.push('High risk: Advanced age');
    clinicalAlerts.push('Consider reduced dosing for elderly patient');
  }
  
  if (extractedData.polypharmacy_risk) {
    riskIndicators.push('High risk: Polypharmacy detected');
    clinicalAlerts.push('Monitor for drug interactions and adverse effects');
    monitoringSuggestions.push('Regular medication review recommended');
  }
  
  if (extractedData.kidney_function !== 'normal') {
    riskIndicators.push('Moderate risk: Kidney impairment');
    clinicalAlerts.push('Monitor renal function and adjust drug dosing');
    monitoringSuggestions.push('Check creatinine and eGFR regularly');
  }
  
  if (extractedData.liver_function !== 'normal') {
    riskIndicators.push('Moderate risk: Liver impairment');
    clinicalAlerts.push('Monitor liver function and drug metabolism');
    monitoringSuggestions.push('Check LFTs and consider dose adjustments');
  }
  
  // Calculate confidence score
  const confidenceScore = calculateConfidenceScore(extractedData);
  
  return {
    extracted_data: extractedData,
    risk_indicators: riskIndicators,
    clinical_alerts: clinicalAlerts,
    monitoring_suggestions: monitoringSuggestions,
    confidence_score: confidenceScore
  };
}

// Calculate confidence score based on data completeness
function calculateConfidenceScore(extractedData: ExtractedPatientData): number {
  let score = 0;
  
  // Base score for required fields
  if (extractedData.patient_name) score += 20;
  if (extractedData.age > 0) score += 20;
  if (extractedData.gender) score += 10;
  if (extractedData.kidney_function) score += 15;
  if (extractedData.liver_function) score += 15;
  if (extractedData.medications.length > 0) score += 20;
  
  return Math.min(score, 100);
}

// Export JSON for external use
export function exportPatientDataJSON(patientData: any): string {
  const extractedData = extractPatientDataJSON(patientData);
  const analysis = performRealTimeAnalysis(extractedData);
  
  return JSON.stringify({
    patient_data: extractedData,
    real_time_analysis: analysis,
    export_timestamp: new Date().toISOString(),
    version: '1.0'
  }, null, 2);
}

// Get structured data for API calls
export function getStructuredDataForAPI(patientData: any) {
  return {
    patient_name: patientData.name,
    age: patientData.age,
    gender: patientData.gender,
    kidney_function: patientData.kidneyFunction,
    liver_function: patientData.liverFunction,
    medications: patientData.medications.map((med: any) => ({
      name: med.name,
      dose: med.dosage,
      frequency: med.frequency,
      category: med.category
    }))
  };
}
