// Drug interaction mapping system that connects DrugBank IDs to STITCH IDs

export interface DrugInteractionData {
  drug1: string;
  drug2: string;
  sideEffect: string;
  severity: 'low' | 'moderate' | 'high' | 'severe';
  interactionType: string;
  severityNumeric: number;
  hasInteraction: boolean;
}

// Mapping from DrugBank ID to STITCH ID (simplified mapping)
// const drugBankToStitchMapping: Map<string, string> = new Map();

// Load drug interaction data
let drugInteractions: Map<string, DrugInteractionData[]> = new Map();

export async function loadDrugInteractions() {
  try {
    console.log('🔄 Loading drug interactions from drug_interactions.csv...');
    
    const response = await fetch('/data/processed/drug_interactions.csv');
    if (!response.ok) {
      throw new Error('Failed to load drug interactions');
    }
    
    const csvText = await response.text();
    const lines = csvText.split('\n').slice(1); // Skip header
    
    let loadedCount = 0;
    let errorCount = 0;
    
    // Process first 10000 lines for performance (sample of the 4M+ interactions)
    const sampleLines = lines.slice(0, 10000);
    
    sampleLines.forEach((line, index) => {
      if (line.trim()) {
        try {
          const columns = line.split(',');
          if (columns.length >= 7) {
            const drug1 = columns[0]?.trim();
            const drug2 = columns[1]?.trim();
            const sideEffect = columns[2]?.trim();
            const severity = columns[3]?.trim() as 'low' | 'moderate' | 'high' | 'severe';
            const interactionType = columns[4]?.trim();
            const severityNumeric = parseInt(columns[5]) || 0;
            const hasInteraction = columns[6]?.trim() === '1';
            
            if (drug1 && drug2 && hasInteraction) {
              const interaction: DrugInteractionData = {
                drug1,
                drug2,
                sideEffect,
                severity,
                interactionType,
                severityNumeric,
                hasInteraction
              };
              
              // Store interaction by drug1 for quick lookup
              if (!drugInteractions.has(drug1)) {
                drugInteractions.set(drug1, []);
              }
              drugInteractions.get(drug1)!.push(interaction);
              
              loadedCount++;
            }
          }
        } catch (error) {
          errorCount++;
          if (errorCount < 10) {
            console.warn(`Error parsing interaction line ${index + 2}:`, error);
          }
        }
      }
    });

    console.log(`✅ Loaded ${loadedCount} drug interactions`);
    console.log(`⚠️ ${errorCount} lines had parsing errors`);
    
    return true;
  } catch (error) {
    console.error('❌ Error loading drug interactions:', error);
    return false;
  }
}

// Find interactions between two drugs using DrugBank IDs
export function findDrugInteractions(drug1Id: string, drug2Id: string): DrugInteractionData[] {
  const interactions: DrugInteractionData[] = [];
  
  // Convert DrugBank ID to STITCH ID (simplified mapping)
  const stitch1 = drugBankToStitchId(drug1Id);
  const stitch2 = drugBankToStitchId(drug2Id);
  
  if (stitch1 && stitch2) {
    // Look for interactions in both directions
    const interactions1 = drugInteractions.get(stitch1) || [];
    const interactions2 = drugInteractions.get(stitch2) || [];
    
    // Find matching interactions
    interactions1.forEach(interaction => {
      if (interaction.drug2 === stitch2) {
        interactions.push(interaction);
      }
    });
    
    interactions2.forEach(interaction => {
      if (interaction.drug2 === stitch1) {
        interactions.push(interaction);
      }
    });
  }
  
  return interactions;
}

// Convert DrugBank ID to STITCH ID (simplified mapping)
function drugBankToStitchId(drugBankId: string): string | null {
  // This is a simplified mapping - in reality, you'd need a proper mapping table
  // For now, we'll use a pattern-based approach
  if (drugBankId.startsWith('DB')) {
    // Convert DB00001 to CID000000001 format
    const number = drugBankId.replace('DB', '').padStart(9, '0');
    return `CID${number}`;
  }
  return null;
}

// Get all interactions for a single drug
export function getDrugInteractions(drugId: string): DrugInteractionData[] {
  const stitchId = drugBankToStitchId(drugId);
  if (stitchId) {
    return drugInteractions.get(stitchId) || [];
  }
  return [];
}

// Calculate interaction risk score
export function calculateInteractionRiskScore(interactions: DrugInteractionData[]): number {
  if (interactions.length === 0) return 0;
  
  let totalScore = 0;
  interactions.forEach(interaction => {
    switch (interaction.severity) {
      case 'severe': totalScore += 4; break;
      case 'high': totalScore += 3; break;
      case 'moderate': totalScore += 2; break;
      case 'low': totalScore += 1; break;
    }
  });
  
  // Normalize to 0-10 scale
  return Math.min(10, totalScore);
}

// Get interaction statistics
export function getInteractionStats() {
  const totalInteractions = Array.from(drugInteractions.values())
    .reduce((sum, interactions) => sum + interactions.length, 0);
  
  const severityCounts = { low: 0, moderate: 0, high: 0, severe: 0 };
  Array.from(drugInteractions.values()).forEach(interactions => {
    interactions.forEach(interaction => {
      severityCounts[interaction.severity]++;
    });
  });
  
  return {
    totalInteractions,
    severityCounts,
    uniqueDrugs: drugInteractions.size
  };
}

// Initialize drug interactions
export async function initializeDrugInteractions() {
  console.log('🚀 Initializing drug interactions...');
  await loadDrugInteractions();
  console.log('✅ Drug interactions initialized successfully');
}
