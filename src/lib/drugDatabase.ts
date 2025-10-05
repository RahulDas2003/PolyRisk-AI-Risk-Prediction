// Drug database integration with processed datasets

export interface DrugInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  elderlyRiskFactors: string[];
}

export interface DrugInteraction {
  drug1_id: string;
  drug2_id: string;
  severity: 'low' | 'moderate' | 'high' | 'severe';
  interaction_type: string;
  description: string;
  management: string;
}

export interface SideEffect {
  drug_id: string;
  side_effect: string;
  frequency: number;
}

// In-memory drug database (loaded from CSV)
let drugDatabase: Map<string, DrugInfo> = new Map();
let drugInteractions: Map<string, DrugInteraction[]> = new Map();

// Load drug database from processed data
export async function loadDrugDatabase() {
  try {
    // Load drug features
    const drugFeaturesResponse = await fetch('/data/processed/drug_features.csv');
    const drugFeaturesText = await drugFeaturesResponse.text();
    const drugFeaturesLines = drugFeaturesText.split('\n').slice(1); // Skip header
    
    drugFeaturesLines.forEach(line => {
      if (line.trim()) {
        const [id, name, description, , , , category, elderlyRiskFactors] = line.split(',');
        if (id && name) {
          drugDatabase.set(id, {
            id,
            name: name.replace(/"/g, ''),
            description: description ? description.replace(/"/g, '') : '',
            category: category || 'other',
            elderlyRiskFactors: elderlyRiskFactors ? JSON.parse(elderlyRiskFactors) : []
          });
        }
      }
    });

    console.log(`Loaded ${drugDatabase.size} drugs from database`);
    return true;
  } catch (error) {
    console.error('Error loading drug database:', error);
    return false;
  }
}

// Load drug interactions (sample for performance)
export async function loadDrugInteractions() {
  try {
    // For performance, we'll load a sample of interactions
    // In production, this would be loaded from a database or API
    const sampleInteractions: DrugInteraction[] = [
      {
        drug1_id: 'DB00001',
        drug2_id: 'DB00002',
        severity: 'high',
        interaction_type: 'pharmacokinetic',
        description: 'Increased bleeding risk due to additive anticoagulant effects',
        management: 'Monitor INR closely, consider dose reduction'
      },
      {
        drug1_id: 'DB00003',
        drug2_id: 'DB00004',
        severity: 'moderate',
        interaction_type: 'pharmacodynamic',
        description: 'Potential for increased toxicity',
        management: 'Monitor for adverse effects, consider dose adjustment'
      }
    ];

    // Group interactions by drug1_id for quick lookup
    sampleInteractions.forEach(interaction => {
      if (!drugInteractions.has(interaction.drug1_id)) {
        drugInteractions.set(interaction.drug1_id, []);
      }
      drugInteractions.get(interaction.drug1_id)!.push(interaction);
    });

    console.log(`Loaded ${sampleInteractions.length} drug interactions`);
    return true;
  } catch (error) {
    console.error('Error loading drug interactions:', error);
    return false;
  }
}

// Search drugs by name
export function searchDrugs(query: string, limit: number = 20): DrugInfo[] {
  const results: DrugInfo[] = [];
  const queryLower = query.toLowerCase();
  
  for (const drug of Array.from(drugDatabase.values())) {
    if (drug.name.toLowerCase().includes(queryLower)) {
      results.push(drug);
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

// Get drug by ID
export function getDrugById(id: string): DrugInfo | undefined {
  return drugDatabase.get(id);
}

// Get drug interactions for a specific drug
export function getDrugInteractions(drugId: string): DrugInteraction[] {
  return drugInteractions.get(drugId) || [];
}

// Find interactions between two drugs
export function findDrugInteraction(drug1Id: string, drug2Id: string): DrugInteraction | null {
  const interactions = drugInteractions.get(drug1Id) || [];
  return interactions.find(interaction => interaction.drug2_id === drug2Id) || null;
}

// Calculate risk score based on interactions (0-10 scale)
export function calculateRiskScore(
  medications: Array<{ id: string; name: string }>,
  patientAge: number,
  kidneyFunction: string,
  liverFunction: string
): number {
  let baseScore = 0;
  
  // Age factor (0-2 points)
  if (patientAge >= 80) baseScore += 2;
  else if (patientAge >= 75) baseScore += 1.5;
  else if (patientAge >= 70) baseScore += 1;
  
  // Organ function factors (0-2 points each)
  if (kidneyFunction === 'severe') baseScore += 2;
  else if (kidneyFunction === 'moderate') baseScore += 1;
  else if (kidneyFunction === 'mild') baseScore += 0.5;
  
  if (liverFunction === 'severe') baseScore += 2;
  else if (liverFunction === 'moderate') baseScore += 1;
  else if (liverFunction === 'mild') baseScore += 0.5;
  
  // Polypharmacy factor (0-2 points)
  const numMeds = medications.length;
  if (numMeds >= 8) baseScore += 2;
  else if (numMeds >= 6) baseScore += 1.5;
  else if (numMeds >= 4) baseScore += 1;
  
  // Drug interaction factor (0-4 points)
  let interactionScore = 0;
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const interaction = findDrugInteraction(medications[i].id, medications[j].id);
      if (interaction) {
        switch (interaction.severity) {
          case 'severe': interactionScore += 1.5; break;
          case 'high': interactionScore += 1; break;
          case 'moderate': interactionScore += 0.5; break;
          case 'low': interactionScore += 0.2; break;
        }
      }
    }
  }
  
  baseScore += Math.min(interactionScore, 4);
  
  // Normalize to 0-10 scale
  return Math.min(10, Math.max(0, baseScore));
}

// Get AI-generated clinical recommendations
export async function getAIClinicalRecommendations(
  riskScore: number,
  interactions: DrugInteraction[],
  patientAge: number,
  medications: Array<{ id: string; name: string }>
): Promise<string[]> {
  // Simulate AI-generated recommendations based on risk factors
  const recommendations: string[] = [];
  
  if (riskScore >= 8) {
    recommendations.push('URGENT: Immediate medication review required');
    recommendations.push('Consider hospitalization for close monitoring');
  } else if (riskScore >= 6) {
    recommendations.push('High risk - Schedule immediate follow-up within 48 hours');
    recommendations.push('Consider reducing medication burden');
  } else if (riskScore >= 4) {
    recommendations.push('Moderate risk - Schedule follow-up within 1 week');
    recommendations.push('Monitor for adverse drug reactions');
  } else {
    recommendations.push('Low risk - Continue current regimen with routine monitoring');
  }
  
  if (patientAge >= 75) {
    recommendations.push('Elderly patient - Use lowest effective doses');
    recommendations.push('Monitor for falls and cognitive changes');
  }
  
  if (interactions.length > 0) {
    recommendations.push(`Monitor for ${interactions.length} identified drug interactions`);
  }
  
  if (medications.length >= 5) {
    recommendations.push('Polypharmacy detected - Consider deprescribing review');
  }
  
  return recommendations;
}

// Get AI-generated monitoring parameters
export async function getAIMonitoringData(
  medications: Array<{ id: string; name: string }>,
  interactions: DrugInteraction[]
): Promise<Array<{ parameter: string; frequency: string; target: string; critical: string }>> {
  // Simulate AI-generated monitoring based on medications and interactions
  const monitoring: Array<{ parameter: string; frequency: string; target: string; critical: string }> = [];
  
  // Check for anticoagulants
  const hasAnticoagulant = medications.some(med => 
    med.name.toLowerCase().includes('warfarin') || 
    med.name.toLowerCase().includes('heparin') ||
    med.name.toLowerCase().includes('rivaroxaban')
  );
  
  if (hasAnticoagulant) {
    monitoring.push({
      parameter: 'INR',
      frequency: 'Weekly',
      target: '2.0-3.0',
      critical: '>4.0 or <1.5'
    });
  }
  
  // Check for diabetes medications
  const hasDiabetesMed = medications.some(med => 
    med.name.toLowerCase().includes('metformin') || 
    med.name.toLowerCase().includes('insulin')
  );
  
  if (hasDiabetesMed) {
    monitoring.push({
      parameter: 'Blood Glucose',
      frequency: 'Daily',
      target: '80-180 mg/dL',
      critical: '<70 or >300 mg/dL'
    });
  }
  
  // Check for kidney function
  const hasNephrotoxic = medications.some(med => 
    med.name.toLowerCase().includes('furosemide') || 
    med.name.toLowerCase().includes('digoxin')
  );
  
  if (hasNephrotoxic) {
    monitoring.push({
      parameter: 'Creatinine',
      frequency: 'Bi-weekly',
      target: '<1.5 mg/dL',
      critical: '>2.0 mg/dL'
    });
  }
  
  // Default monitoring
  if (monitoring.length === 0) {
    monitoring.push({
      parameter: 'Vital Signs',
      frequency: 'Monthly',
      target: 'Normal ranges',
      critical: 'Any abnormality'
    });
  }
  
  return monitoring;
}

// Get AI-generated alternatives
export async function getAIAlternatives(
  medications: Array<{ id: string; name: string }>,
  interactions: DrugInteraction[]
): Promise<Array<{ drug: string; advantages: string[]; disadvantages: string[]; recommendation: string }>> {
  // Simulate AI-generated alternatives based on interactions
  const alternatives: Array<{ drug: string; advantages: string[]; disadvantages: string[]; recommendation: string }> = [];
  
  // Generate alternatives for high-risk interactions
  interactions.filter(i => i.severity === 'high' || i.severity === 'severe').forEach(interaction => {
    const drug1 = getDrugById(interaction.drug1_id);
    const drug2 = getDrugById(interaction.drug2_id);
    
    if (drug1 && drug2) {
      alternatives.push({
        drug: `Alternative to ${drug1.name}`,
        advantages: ['Lower interaction risk', 'Better safety profile', 'Easier monitoring'],
        disadvantages: ['May require dose adjustment', 'Different side effect profile'],
        recommendation: `Consider replacing ${drug1.name} due to high-risk interaction with ${drug2.name}`
      });
    }
  });
  
  // Default alternatives if no high-risk interactions
  if (alternatives.length === 0) {
    alternatives.push({
      drug: 'Current regimen appears safe',
      advantages: ['No major interactions identified', 'Established efficacy'],
      disadvantages: ['Continue monitoring required'],
      recommendation: 'Current medication regimen is appropriate with continued monitoring'
    });
  }
  
  return alternatives;
}

// Initialize the drug database
export async function initializeDrugDatabase() {
  await loadDrugDatabase();
  await loadDrugInteractions();
}
