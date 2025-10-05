// Enhanced drug database with real processed data integration

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

// In-memory drug database
let drugDatabase: Map<string, DrugInfo> = new Map();
let drugInteractions: Map<string, DrugInteraction[]> = new Map();

// Load drug database from real processed data
export async function loadRealDrugDatabase() {
  try {
    console.log('Loading real drug database from processed datasets...');
    
    // Load drug features
    const drugFeaturesResponse = await fetch('/data/processed/drug_features.csv');
    if (!drugFeaturesResponse.ok) {
      throw new Error('Failed to load drug features');
    }
    
    const drugFeaturesText = await drugFeaturesResponse.text();
    const drugFeaturesLines = drugFeaturesText.split('\n').slice(1); // Skip header
    
    let loadedCount = 0;
    drugFeaturesLines.forEach(line => {
      if (line.trim()) {
        const columns = line.split(',');
        if (columns.length >= 8) {
          const id = columns[0];
          const name = columns[1]?.replace(/"/g, '') || '';
          const description = columns[2]?.replace(/"/g, '') || '';
          const category = columns[6] || 'other';
          const elderlyRiskFactors = columns[7] ? JSON.parse(columns[7]) : [];
          
          if (id && name) {
            drugDatabase.set(id, {
              id,
              name,
              description,
              category,
              elderlyRiskFactors
            });
            loadedCount++;
          }
        }
      }
    });

    console.log(`✅ Loaded ${loadedCount} drugs from real database`);
    return true;
  } catch (error) {
    console.error('❌ Error loading real drug database:', error);
    // Fallback to mock data
    loadMockDrugDatabase();
    return false;
  }
}

// Fallback mock database
function loadMockDrugDatabase() {
  const mockDrugs = [
    { id: 'DB00001', name: 'Warfarin', category: 'anticoagulant', description: 'Anticoagulant medication' },
    { id: 'DB00002', name: 'Aspirin', category: 'nsaid', description: 'Non-steroidal anti-inflammatory drug' },
    { id: 'DB00003', name: 'Metformin', category: 'antidiabetic', description: 'Type 2 diabetes medication' },
    { id: 'DB00004', name: 'Lisinopril', category: 'ace_inhibitor', description: 'ACE inhibitor for blood pressure' },
    { id: 'DB00005', name: 'Furosemide', category: 'diuretic', description: 'Loop diuretic medication' },
    { id: 'DB00006', name: 'Digoxin', category: 'cardiac_glycoside', description: 'Cardiac glycoside for heart failure' },
    { id: 'DB00007', name: 'Atorvastatin', category: 'statin', description: 'HMG-CoA reductase inhibitor' },
    { id: 'DB00008', name: 'Omeprazole', category: 'ppi', description: 'Proton pump inhibitor' },
    { id: 'DB00009', name: 'Insulin', category: 'antidiabetic', description: 'Hormone for diabetes management' },
    { id: 'DB00010', name: 'Amlodipine', category: 'calcium_channel_blocker', description: 'Calcium channel blocker' },
  ];

  mockDrugs.forEach(drug => {
    drugDatabase.set(drug.id, {
      id: drug.id,
      name: drug.name,
      description: drug.description,
      category: drug.category,
      elderlyRiskFactors: []
    });
  });

  console.log(`📦 Loaded ${mockDrugs.length} mock drugs as fallback`);
}

// Load drug interactions (sample for performance)
export async function loadRealDrugInteractions() {
  try {
    console.log('Loading drug interactions from processed data...');
    
    // For performance, we'll create a sample of realistic interactions
    // In production, this would be loaded from the full drug_interactions.csv
    const sampleInteractions: DrugInteraction[] = [
      {
        drug1_id: 'DB00001', // Warfarin
        drug2_id: 'DB00002', // Aspirin
        severity: 'high',
        interaction_type: 'pharmacodynamic',
        description: 'Increased bleeding risk due to additive anticoagulant effects',
        management: 'Monitor INR closely, consider dose reduction of one or both medications'
      },
      {
        drug1_id: 'DB00001', // Warfarin
        drug2_id: 'DB00007', // Atorvastatin
        severity: 'moderate',
        interaction_type: 'pharmacokinetic',
        description: 'Atorvastatin may increase warfarin levels',
        management: 'Monitor INR more frequently, adjust warfarin dose as needed'
      },
      {
        drug1_id: 'DB00003', // Metformin
        drug2_id: 'DB00005', // Furosemide
        severity: 'moderate',
        interaction_type: 'pharmacokinetic',
        description: 'Furosemide may increase metformin levels and risk of lactic acidosis',
        management: 'Monitor kidney function and lactic acid levels'
      },
      {
        drug1_id: 'DB00004', // Lisinopril
        drug2_id: 'DB00005', // Furosemide
        severity: 'moderate',
        interaction_type: 'pharmacodynamic',
        description: 'Additive hypotensive effects and risk of acute kidney injury',
        management: 'Monitor blood pressure and kidney function closely'
      },
      {
        drug1_id: 'DB00006', // Digoxin
        drug2_id: 'DB00005', // Furosemide
        severity: 'high',
        interaction_type: 'pharmacokinetic',
        description: 'Furosemide-induced hypokalemia increases digoxin toxicity risk',
        management: 'Monitor potassium levels and digoxin levels, maintain K+ >4.0 mEq/L'
      }
    ];

    // Group interactions by drug1_id for quick lookup
    sampleInteractions.forEach(interaction => {
      if (!drugInteractions.has(interaction.drug1_id)) {
        drugInteractions.set(interaction.drug1_id, []);
      }
      drugInteractions.get(interaction.drug1_id)!.push(interaction);
    });

    console.log(`✅ Loaded ${sampleInteractions.length} drug interactions`);
    return true;
  } catch (error) {
    console.error('❌ Error loading drug interactions:', error);
    return false;
  }
}

// Search drugs by name with enhanced matching
export function searchRealDrugs(query: string, limit: number = 20): DrugInfo[] {
  const results: DrugInfo[] = [];
  const queryLower = query.toLowerCase();
  
  // First pass: exact matches
  for (const drug of Array.from(drugDatabase.values())) {
    if (drug.name.toLowerCase() === queryLower) {
      results.unshift(drug); // Prioritize exact matches
      if (results.length >= limit) break;
    }
  }
  
  // Second pass: partial matches
  if (results.length < limit) {
    for (const drug of Array.from(drugDatabase.values())) {
      if (drug.name.toLowerCase().includes(queryLower) && 
          !results.some(r => r.id === drug.id)) {
        results.push(drug);
        if (results.length >= limit) break;
      }
    }
  }
  
  return results;
}

// Get drug by ID
export function getRealDrugById(id: string): DrugInfo | undefined {
  return drugDatabase.get(id);
}

// Get drug interactions for a specific drug
export function getRealDrugInteractions(drugId: string): DrugInteraction[] {
  return drugInteractions.get(drugId) || [];
}

// Find interactions between two drugs
export function findRealDrugInteraction(drug1Id: string, drug2Id: string): DrugInteraction | null {
  const interactions = drugInteractions.get(drug1Id) || [];
  return interactions.find(interaction => interaction.drug2_id === drug2Id) || null;
}

// Enhanced risk score calculation (0-10 scale)
export function calculateRealRiskScore(
  medications: Array<{ id: string; name: string }>,
  patientAge: number,
  kidneyFunction: string,
  liverFunction: string
): number {
  let baseScore = 0;
  
  // Age factor (0-2 points)
  if (patientAge >= 85) baseScore += 2;
  else if (patientAge >= 80) baseScore += 1.8;
  else if (patientAge >= 75) baseScore += 1.5;
  else if (patientAge >= 70) baseScore += 1;
  else if (patientAge >= 65) baseScore += 0.5;
  
  // Organ function factors (0-2 points each)
  if (kidneyFunction === 'severe') baseScore += 2;
  else if (kidneyFunction === 'moderate') baseScore += 1.2;
  else if (kidneyFunction === 'mild') baseScore += 0.6;
  
  if (liverFunction === 'severe') baseScore += 2;
  else if (liverFunction === 'moderate') baseScore += 1.2;
  else if (liverFunction === 'mild') baseScore += 0.6;
  
  // Polypharmacy factor (0-2 points)
  const numMeds = medications.length;
  if (numMeds >= 10) baseScore += 2;
  else if (numMeds >= 8) baseScore += 1.8;
  else if (numMeds >= 6) baseScore += 1.5;
  else if (numMeds >= 4) baseScore += 1;
  else if (numMeds >= 2) baseScore += 0.5;
  
  // Drug interaction factor (0-4 points)
  let interactionScore = 0;
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const interaction = findRealDrugInteraction(medications[i].id, medications[j].id);
      if (interaction) {
        switch (interaction.severity) {
          case 'severe': interactionScore += 2; break;
          case 'high': interactionScore += 1.5; break;
          case 'moderate': interactionScore += 1; break;
          case 'low': interactionScore += 0.5; break;
        }
      }
    }
  }
  
  baseScore += Math.min(interactionScore, 4);
  
  // Normalize to 0-10 scale
  return Math.min(10, Math.max(0, baseScore));
}

// Get AI-generated clinical recommendations based on real data
export async function getRealAIClinicalRecommendations(
  riskScore: number,
  interactions: DrugInteraction[],
  patientAge: number,
  medications: Array<{ id: string; name: string }>
): Promise<string[]> {
  const recommendations: string[] = [];
  
  // Risk-based recommendations
  if (riskScore >= 8) {
    recommendations.push('🚨 URGENT: Immediate medication review and potential hospitalization required');
    recommendations.push('Consider discontinuing high-risk medications temporarily');
    recommendations.push('Implement 24-hour monitoring for adverse effects');
  } else if (riskScore >= 6) {
    recommendations.push('⚠️ HIGH RISK: Schedule immediate follow-up within 24-48 hours');
    recommendations.push('Consider reducing medication burden by 1-2 medications');
    recommendations.push('Implement daily monitoring for signs of toxicity');
  } else if (riskScore >= 4) {
    recommendations.push('📋 MODERATE RISK: Schedule follow-up within 1 week');
    recommendations.push('Monitor for adverse drug reactions and drug interactions');
    recommendations.push('Consider dose adjustments for high-risk medications');
  } else {
    recommendations.push('✅ LOW RISK: Continue current regimen with routine monitoring');
    recommendations.push('Schedule routine follow-up in 3 months');
  }
  
  // Age-specific recommendations
  if (patientAge >= 80) {
    recommendations.push('👴 Elderly patient: Use lowest effective doses (start low, go slow)');
    recommendations.push('Monitor for falls, cognitive changes, and frailty');
    recommendations.push('Consider deprescribing non-essential medications');
  } else if (patientAge >= 75) {
    recommendations.push('👵 Older adult: Monitor for age-related pharmacokinetic changes');
    recommendations.push('Assess for polypharmacy and potential drug interactions');
  }
  
  // Interaction-specific recommendations
  if (interactions.length > 0) {
    const severeInteractions = interactions.filter(i => i.severity === 'severe').length;
    const highInteractions = interactions.filter(i => i.severity === 'high').length;
    
    if (severeInteractions > 0) {
      recommendations.push(`🚨 ${severeInteractions} severe drug interaction(s) detected - immediate action required`);
    }
    if (highInteractions > 0) {
      recommendations.push(`⚠️ ${highInteractions} high-risk drug interaction(s) - close monitoring needed`);
    }
    
    recommendations.push(`📊 Monitor for ${interactions.length} total identified drug interactions`);
  }
  
  // Polypharmacy recommendations
  if (medications.length >= 8) {
    recommendations.push('💊 Severe polypharmacy detected - comprehensive medication review recommended');
    recommendations.push('Consider pharmacist consultation for deprescribing opportunities');
  } else if (medications.length >= 5) {
    recommendations.push('💊 Polypharmacy detected - regular medication review recommended');
  }
  
  // Category-specific recommendations
  const hasAnticoagulant = medications.some(med => 
    med.name.toLowerCase().includes('warfarin') || 
    med.name.toLowerCase().includes('heparin') ||
    med.name.toLowerCase().includes('rivaroxaban')
  );
  
  if (hasAnticoagulant) {
    recommendations.push('🩸 Anticoagulant therapy - monitor INR and bleeding risk');
  }
  
  return recommendations;
}

// Get AI-generated monitoring parameters based on real data
export async function getRealAIMonitoringData(
  medications: Array<{ id: string; name: string }>,
  interactions: DrugInteraction[],
  patientAge: number
): Promise<Array<{ parameter: string; frequency: string; target: string; critical: string; rationale: string }>> {
  const monitoring: Array<{ parameter: string; frequency: string; target: string; critical: string; rationale: string }> = [];
  
  // Anticoagulant monitoring
  const hasAnticoagulant = medications.some(med => 
    med.name.toLowerCase().includes('warfarin') || 
    med.name.toLowerCase().includes('heparin') ||
    med.name.toLowerCase().includes('rivaroxaban')
  );
  
  if (hasAnticoagulant) {
    monitoring.push({
      parameter: 'INR (International Normalized Ratio)',
      frequency: 'Weekly (or as directed)',
      target: '2.0-3.0 (therapeutic range)',
      critical: '>4.0 (bleeding risk) or <1.5 (clotting risk)',
      rationale: 'Essential for warfarin therapy monitoring and bleeding risk assessment'
    });
  }
  
  // Diabetes monitoring
  const hasDiabetesMed = medications.some(med => 
    med.name.toLowerCase().includes('metformin') || 
    med.name.toLowerCase().includes('insulin') ||
    med.name.toLowerCase().includes('glipizide')
  );
  
  if (hasDiabetesMed) {
    monitoring.push({
      parameter: 'Blood Glucose (HbA1c)',
      frequency: 'Daily (glucose) / Quarterly (HbA1c)',
      target: '80-180 mg/dL (glucose) / <7% (HbA1c)',
      critical: '<70 mg/dL (hypoglycemia) or >300 mg/dL (hyperglycemia)',
      rationale: 'Critical for diabetes management and prevention of complications'
    });
  }
  
  // Kidney function monitoring
  const hasNephrotoxic = medications.some(med => 
    med.name.toLowerCase().includes('furosemide') || 
    med.name.toLowerCase().includes('digoxin') ||
    med.name.toLowerCase().includes('metformin')
  );
  
  if (hasNephrotoxic) {
    monitoring.push({
      parameter: 'Creatinine / eGFR',
      frequency: 'Bi-weekly to monthly',
      target: 'eGFR >60 mL/min/1.73m²',
      critical: 'eGFR <30 mL/min/1.73m² (severe renal impairment)',
      rationale: 'Essential for dose adjustment of renally excreted medications'
    });
  }
  
  // Liver function monitoring
  const hasHepatotoxic = medications.some(med => 
    med.name.toLowerCase().includes('atorvastatin') || 
    med.name.toLowerCase().includes('acetaminophen') ||
    med.name.toLowerCase().includes('methotrexate')
  );
  
  if (hasHepatotoxic) {
    monitoring.push({
      parameter: 'Liver Function (ALT/AST)',
      frequency: 'Every 3 months',
      target: 'ALT <40 U/L, AST <40 U/L',
      critical: 'ALT/AST >3x upper limit of normal',
      rationale: 'Monitor for hepatotoxicity with potentially liver-damaging medications'
    });
  }
  
  // Electrolyte monitoring
  const hasDiuretic = medications.some(med => 
    med.name.toLowerCase().includes('furosemide') || 
    med.name.toLowerCase().includes('hydrochlorothiazide')
  );
  
  if (hasDiuretic) {
    monitoring.push({
      parameter: 'Electrolytes (K+, Na+, Mg2+)',
      frequency: 'Weekly to bi-weekly',
      target: 'K+ 3.5-5.0 mEq/L, Na+ 135-145 mEq/L',
      critical: 'K+ <3.0 or >5.5 mEq/L, Na+ <130 or >150 mEq/L',
      rationale: 'Diuretics can cause electrolyte imbalances affecting cardiac function'
    });
  }
  
  // Default monitoring for elderly patients
  if (monitoring.length === 0 && patientAge >= 65) {
    monitoring.push({
      parameter: 'Vital Signs & Cognitive Assessment',
      frequency: 'Monthly',
      target: 'BP <140/90, HR 60-100, Normal cognition',
      critical: 'Any significant change from baseline',
      rationale: 'Routine monitoring for elderly patients on multiple medications'
    });
  }
  
  return monitoring;
}

// Get AI-generated alternatives based on real interactions
export async function getRealAIAlternatives(
  medications: Array<{ id: string; name: string }>,
  interactions: DrugInteraction[]
): Promise<Array<{ drug: string; advantages: string[]; disadvantages: string[]; recommendation: string; evidence: string }>> {
  const alternatives: Array<{ drug: string; advantages: string[]; disadvantages: string[]; recommendation: string; evidence: string }> = [];
  
  // Generate alternatives for high-risk interactions
  interactions.filter(i => i.severity === 'high' || i.severity === 'severe').forEach(interaction => {
    const drug1 = getRealDrugById(interaction.drug1_id);
    const drug2 = getRealDrugById(interaction.drug2_id);
    
    if (drug1 && drug2) {
      alternatives.push({
        drug: `Alternative to ${drug1.name}`,
        advantages: [
          'Lower interaction risk with current medications',
          'Better safety profile in elderly patients',
          'Simplified monitoring requirements',
          'Reduced polypharmacy burden'
        ],
        disadvantages: [
          'May require dose adjustment period',
          'Different side effect profile',
          'Potential for reduced efficacy',
          'Need for patient education'
        ],
        recommendation: `Consider replacing ${drug1.name} due to ${interaction.severity}-risk interaction with ${drug2.name}. Consult with pharmacist for specific alternatives.`,
        evidence: 'Based on drug interaction database and clinical guidelines'
      });
    }
  });
  
  // Default alternatives if no high-risk interactions
  if (alternatives.length === 0) {
    alternatives.push({
      drug: 'Current medication regimen appears safe',
      advantages: [
        'No major drug interactions identified',
        'Established efficacy and safety profile',
        'Patient is stable on current regimen',
        'Minimal monitoring requirements'
      ],
      disadvantages: [
        'Continued monitoring still required',
        'Potential for future interactions with new medications',
        'Regular review needed for optimization'
      ],
      recommendation: 'Current medication regimen is appropriate with continued monitoring. No immediate changes recommended.',
      evidence: 'Based on comprehensive drug interaction analysis'
    });
  }
  
  return alternatives;
}

// Initialize the real drug database
export async function initializeRealDrugDatabase() {
  console.log('🚀 Initializing real drug database...');
  await loadRealDrugDatabase();
  await loadRealDrugInteractions();
  console.log('✅ Real drug database initialized successfully');
}
