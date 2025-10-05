// Patient Data API Service
// Handles saving patient data to backend server

export interface PatientDataAPIResponse {
  success: boolean;
  message: string;
  patientId?: string;
  timestamp?: string;
}

export interface PatientDataAPIError {
  error: string;
  details?: string;
  timestamp: string;
}

// Save patient data to backend API
export async function savePatientDataToAPI(patientData: any): Promise<PatientDataAPIResponse> {
  try {
    const response = await fetch('http://localhost:8000/save-patient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patient_data: patientData,
        real_time_analysis: {
          extracted_data: patientData,
          risk_indicators: [],
          clinical_alerts: [],
          monitoring_suggestions: [],
          confidence_score: 85
        },
        export_timestamp: new Date().toISOString(),
        version: '1.0'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Patient data saved to API:', result);
    return result;
  } catch (error) {
    console.error('❌ Error saving patient data to API:', error);
    return {
      success: false,
      message: `Failed to save patient data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Save extracted JSON data to backend API
export async function saveExtractedDataToAPI(extractedData: any): Promise<PatientDataAPIResponse> {
  try {
    const response = await fetch('http://localhost:8000/save-patient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patient_data: extractedData,
        real_time_analysis: {
          extracted_data: extractedData,
          risk_indicators: [],
          clinical_alerts: [],
          monitoring_suggestions: [],
          confidence_score: 85
        },
        export_timestamp: new Date().toISOString(),
        version: '1.0'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Extracted data saved to API:', result);
    return result;
  } catch (error) {
    console.error('❌ Error saving extracted data to API:', error);
    return {
      success: false,
      message: `Failed to save extracted data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Save real-time analysis to backend API
export async function saveAnalysisToAPI(analysis: any): Promise<PatientDataAPIResponse> {
  try {
    const response = await fetch('http://localhost:8000/save-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patient_data: analysis.extracted_data,
        analysis_result: analysis,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Analysis saved to API:', result);
    return result;
  } catch (error) {
    console.error('❌ Error saving analysis to API:', error);
    return {
      success: false,
      message: `Failed to save analysis: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Save all patient data (patient + extracted + analysis) to backend
export async function saveAllPatientDataToAPI(
  patientData: any, 
  extractedData: any, 
  analysis: any
): Promise<PatientDataAPIResponse> {
  try {
    const response = await fetch('http://localhost:8000/save-patient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patient_data: extractedData,
        real_time_analysis: analysis,
        export_timestamp: new Date().toISOString(),
        version: '1.0'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Complete patient data saved to API:', result);
    return result;
  } catch (error) {
    console.error('❌ Error saving complete patient data to API:', error);
    return {
      success: false,
      message: `Failed to save complete patient data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Get saved patient data from API
export async function getPatientDataFromAPI(patientId?: string): Promise<any> {
  try {
    const url = patientId ? `http://localhost:8000/patients/${patientId}` : 'http://localhost:8000/patients';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('📥 Retrieved patient data from API:', result);
    return result;
  } catch (error) {
    console.error('❌ Error retrieving patient data from API:', error);
    return null;
  }
}

// Delete patient data from API
export async function deletePatientDataFromAPI(patientId: string): Promise<PatientDataAPIResponse> {
  try {
    const response = await fetch(`http://localhost:8000/patients/${patientId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('🗑️ Patient data deleted from API:', result);
    return result;
  } catch (error) {
    console.error('❌ Error deleting patient data from API:', error);
    return {
      success: false,
      message: `Failed to delete patient data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Get API statistics
export async function getAPIStats(): Promise<any> {
  try {
    const response = await fetch('http://localhost:8000/stats');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('📊 API Stats retrieved:', result);
    return result;
  } catch (error) {
    console.error('❌ Error retrieving API stats:', error);
    return null;
  }
}
