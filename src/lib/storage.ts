// Data storage utilities for patient analyses

export interface StoredAnalysis {
  id: string;
  patientName: string;
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
  riskScore: number;
  riskLevel: string;
  interactions: Array<{
    drugs: string;
    severity: string;
    description: string;
    management: string;
  }>;
  recommendations: string[];
  timestamp: string;
  status: 'completed' | 'urgent' | 'pending';
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Get stored analyses from localStorage
export function getStoredAnalyses(): StoredAnalysis[] {
  try {
    const stored = localStorage.getItem('polyrisk_analyses');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading stored analyses:', error);
    return [];
  }
}

// Save analysis to localStorage
export function saveAnalysis(analysis: Omit<StoredAnalysis, 'id' | 'timestamp' | 'status'>): StoredAnalysis {
  const newAnalysis: StoredAnalysis = {
    ...analysis,
    id: generateId(),
    timestamp: new Date().toISOString(),
    status: analysis.riskScore >= 75 ? 'urgent' : 'completed'
  };

  const existingAnalyses = getStoredAnalyses();
  const updatedAnalyses = [newAnalysis, ...existingAnalyses];
  
  try {
    localStorage.setItem('polyrisk_analyses', JSON.stringify(updatedAnalyses));
    return newAnalysis;
  } catch (error) {
    console.error('Error saving analysis:', error);
    return newAnalysis;
  }
}

// Delete analysis from localStorage
export function deleteAnalysis(id: string): void {
  try {
    const analyses = getStoredAnalyses();
    const filteredAnalyses = analyses.filter(analysis => analysis.id !== id);
    localStorage.setItem('polyrisk_analyses', JSON.stringify(filteredAnalyses));
  } catch (error) {
    console.error('Error deleting analysis:', error);
  }
}

// Get analysis by ID
export function getAnalysisById(id: string): StoredAnalysis | null {
  const analyses = getStoredAnalyses();
  return analyses.find(analysis => analysis.id === id) || null;
}

// Get recent analyses (last 10)
export function getRecentAnalyses(): StoredAnalysis[] {
  const analyses = getStoredAnalyses();
  return analyses.slice(0, 10);
}

// Get analytics data from stored analyses
export function getAnalyticsData() {
  const analyses = getStoredAnalyses();
  
  if (analyses.length === 0) {
    return {
      totalAnalyses: 0,
      highRiskPatients: 0,
      avgRiskScore: 0,
      riskDistribution: [
        { name: 'Low Risk', value: 0, color: '#10b981' },
        { name: 'Moderate Risk', value: 0, color: '#f59e0b' },
        { name: 'High Risk', value: 0, color: '#ef4444' },
        { name: 'Severe Risk', value: 0, color: '#dc2626' }
      ],
      ageGroupData: [
        { ageGroup: '65-70', low: 0, moderate: 0, high: 0, severe: 0 },
        { ageGroup: '71-75', low: 0, moderate: 0, high: 0, severe: 0 },
        { ageGroup: '76-80', low: 0, moderate: 0, high: 0, severe: 0 },
        { ageGroup: '81-85', low: 0, moderate: 0, high: 0, severe: 0 },
        { ageGroup: '86+', low: 0, moderate: 0, high: 0, severe: 0 }
      ],
      monthlyTrends: []
    };
  }

  const totalAnalyses = analyses.length;
  const highRiskCount = analyses.filter(a => a.riskScore >= 50).length;
  const highRiskPatients = Math.round((highRiskCount / totalAnalyses) * 100);
  const avgRiskScore = Math.round(analyses.reduce((sum, a) => sum + a.riskScore, 0) / totalAnalyses * 10) / 10;

  // Risk distribution
  const riskDistribution = [
    { name: 'Low Risk', value: Math.round((analyses.filter(a => a.riskScore < 25).length / totalAnalyses) * 100), color: '#10b981' },
    { name: 'Moderate Risk', value: Math.round((analyses.filter(a => a.riskScore >= 25 && a.riskScore < 50).length / totalAnalyses) * 100), color: '#f59e0b' },
    { name: 'High Risk', value: Math.round((analyses.filter(a => a.riskScore >= 50 && a.riskScore < 75).length / totalAnalyses) * 100), color: '#ef4444' },
    { name: 'Severe Risk', value: Math.round((analyses.filter(a => a.riskScore >= 75).length / totalAnalyses) * 100), color: '#dc2626' }
  ];

  // Age group analysis
  const ageGroupData = [
    { ageGroup: '65-70', low: 0, moderate: 0, high: 0, severe: 0 },
    { ageGroup: '71-75', low: 0, moderate: 0, high: 0, severe: 0 },
    { ageGroup: '76-80', low: 0, moderate: 0, high: 0, severe: 0 },
    { ageGroup: '81-85', low: 0, moderate: 0, high: 0, severe: 0 },
    { ageGroup: '86+', low: 0, moderate: 0, high: 0, severe: 0 }
  ];

  analyses.forEach(analysis => {
    const ageGroup = analysis.age >= 86 ? '86+' :
                    analysis.age >= 81 ? '81-85' :
                    analysis.age >= 76 ? '76-80' :
                    analysis.age >= 71 ? '71-75' : '65-70';
    
    const groupIndex = ageGroupData.findIndex(g => g.ageGroup === ageGroup);
    if (groupIndex !== -1) {
      if (analysis.riskScore < 25) ageGroupData[groupIndex].low++;
      else if (analysis.riskScore < 50) ageGroupData[groupIndex].moderate++;
      else if (analysis.riskScore < 75) ageGroupData[groupIndex].high++;
      else ageGroupData[groupIndex].severe++;
    }
  });

  // Monthly trends (last 6 months)
  const monthlyTrends = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const monthAnalyses = analyses.filter(a => {
      const analysisDate = new Date(a.timestamp);
      return analysisDate.getMonth() === date.getMonth() && 
             analysisDate.getFullYear() === date.getFullYear();
    });
    monthlyTrends.push({
      month: monthName,
      interactions: monthAnalyses.reduce((sum, a) => sum + a.interactions.length, 0)
    });
  }

  return {
    totalAnalyses,
    highRiskPatients,
    avgRiskScore,
    riskDistribution,
    ageGroupData,
    monthlyTrends
  };
}
