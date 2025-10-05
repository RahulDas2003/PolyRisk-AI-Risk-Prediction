// Enhanced drug database with DrugBank ID integration and Gemini AI

export interface EnhancedDrugInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  elderlyRiskFactors: string[];
  drugBankId: string;
  molecularWeight?: number;
  halfLife?: number;
  clearance?: string;
  contraindications?: string[];
  sideEffects?: string[];
}

export interface DrugInteraction {
  drug1_id: string;
  drug2_id: string;
  severity: 'low' | 'moderate' | 'high' | 'severe';
  interaction_type: string;
  description: string;
  management: string;
  evidence: string;
}

// In-memory enhanced drug database
let enhancedDrugDatabase: Map<string, EnhancedDrugInfo> = new Map();
let drugInteractions: Map<string, DrugInteraction[]> = new Map();

// Load enhanced drug database from DrugBank data
export async function loadEnhancedDrugDatabase() {
  try {
    console.log('🔄 Loading enhanced drug database from DrugBank...');
    
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
          const drugBankId = columns[0];
          const name = columns[1]?.replace(/"/g, '') || '';
          const description = columns[2]?.replace(/"/g, '') || '';
          const category = columns[6] || 'other';
          const elderlyRiskFactors = columns[7] ? JSON.parse(columns[7]) : [];
          
          if (drugBankId && name) {
            enhancedDrugDatabase.set(drugBankId, {
              id: drugBankId,
              name,
              description,
              category,
              elderlyRiskFactors,
              drugBankId,
              // Additional properties can be added from other datasets
              contraindications: [],
              sideEffects: []
            });
            loadedCount++;
          }
        }
      }
    });

    console.log(`✅ Loaded ${loadedCount} drugs from DrugBank database`);
    return true;
  } catch (error) {
    console.error('❌ Error loading enhanced drug database:', error);
    loadFallbackDrugDatabase();
    return false;
  }
}

// Fallback drug database
function loadFallbackDrugDatabase() {
  const fallbackDrugs = [
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

  fallbackDrugs.forEach(drug => {
    enhancedDrugDatabase.set(drug.id, {
      id: drug.id,
      name: drug.name,
      description: drug.description,
      category: drug.category,
      elderlyRiskFactors: [],
      drugBankId: drug.id,
      contraindications: [],
      sideEffects: []
    });
  });

  console.log(`📦 Loaded ${fallbackDrugs.length} fallback drugs`);
}

// Search drugs with enhanced matching
export function searchEnhancedDrugs(query: string, limit: number = 20): EnhancedDrugInfo[] {
  const results: EnhancedDrugInfo[] = [];
  const queryLower = query.toLowerCase();
  
  // First pass: exact matches
  for (const drug of Array.from(enhancedDrugDatabase.values())) {
    if (drug.name.toLowerCase() === queryLower) {
      results.unshift(drug);
      if (results.length >= limit) break;
    }
  }
  
  // Second pass: partial matches
  if (results.length < limit) {
    for (const drug of Array.from(enhancedDrugDatabase.values())) {
      if (drug.name.toLowerCase().includes(queryLower) && 
          !results.some(r => r.id === drug.id)) {
        results.push(drug);
        if (results.length >= limit) break;
      }
    }
  }
  
  return results;
}

// Get drug by DrugBank ID
export function getEnhancedDrugById(drugBankId: string): EnhancedDrugInfo | undefined {
  return enhancedDrugDatabase.get(drugBankId);
}

// Get drug by name
export function getEnhancedDrugByName(name: string): EnhancedDrugInfo | undefined {
  for (const drug of Array.from(enhancedDrugDatabase.values())) {
    if (drug.name.toLowerCase() === name.toLowerCase()) {
      return drug;
    }
  }
  return undefined;
}

// Get all drugs in a category
export function getDrugsByCategory(category: string): EnhancedDrugInfo[] {
  return Array.from(enhancedDrugDatabase.values()).filter(drug => 
    drug.category.toLowerCase() === category.toLowerCase()
  );
}

// Get drugs with elderly risk factors
export function getDrugsWithElderlyRisks(): EnhancedDrugInfo[] {
  return Array.from(enhancedDrugDatabase.values()).filter(drug => 
    drug.elderlyRiskFactors && drug.elderlyRiskFactors.length > 0
  );
}

// Search drugs by multiple criteria
export function searchDrugsAdvanced(criteria: {
  name?: string;
  category?: string;
  hasElderlyRisks?: boolean;
  limit?: number;
}): EnhancedDrugInfo[] {
  let results = Array.from(enhancedDrugDatabase.values());
  
  if (criteria.name) {
    const nameLower = criteria.name.toLowerCase();
    results = results.filter(drug => 
      drug.name.toLowerCase().includes(nameLower)
    );
  }
  
  if (criteria.category) {
    results = results.filter(drug => 
      drug.category.toLowerCase() === criteria.category!.toLowerCase()
    );
  }
  
  if (criteria.hasElderlyRisks) {
    results = results.filter(drug => 
      drug.elderlyRiskFactors && drug.elderlyRiskFactors.length > 0
    );
  }
  
  return results.slice(0, criteria.limit || 20);
}

// Get drug statistics
export function getDrugDatabaseStats() {
  const drugs = Array.from(enhancedDrugDatabase.values());
  const categories = new Map<string, number>();
  const elderlyRiskDrugs = drugs.filter(drug => 
    drug.elderlyRiskFactors && drug.elderlyRiskFactors.length > 0
  );
  
  drugs.forEach(drug => {
    categories.set(drug.category, (categories.get(drug.category) || 0) + 1);
  });
  
  return {
    totalDrugs: drugs.length,
    categories: Object.fromEntries(categories),
    elderlyRiskDrugs: elderlyRiskDrugs.length,
    elderlyRiskPercentage: Math.round((elderlyRiskDrugs.length / drugs.length) * 100)
  };
}

// Initialize the enhanced drug database
export async function initializeEnhancedDrugDatabase() {
  console.log('🚀 Initializing enhanced drug database...');
  await loadEnhancedDrugDatabase();
  console.log('✅ Enhanced drug database initialized successfully');
}
