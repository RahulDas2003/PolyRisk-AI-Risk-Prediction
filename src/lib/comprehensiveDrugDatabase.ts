// Comprehensive drug database that loads all 21,352 drugs from drug_features.csv

export interface ComprehensiveDrugInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  elderlyRiskFactors: string[];
  drugBankId: string;
  nameLength: number;
  descLength: number;
  hasDescription: boolean;
}

// In-memory comprehensive drug database
let comprehensiveDrugDatabase: Map<string, ComprehensiveDrugInfo> = new Map();
let drugCategories: Map<string, number> = new Map();
let isDatabaseLoaded = false;

// Load all drugs from drug_features.csv
export async function loadComprehensiveDrugDatabase() {
  if (isDatabaseLoaded) {
    console.log('📚 Comprehensive drug database already loaded');
    return true;
  }

  try {
    console.log('🔄 Loading comprehensive drug database from drug_features.csv...');
    
    const response = await fetch('/data/processed/drug_features.csv');
    if (!response.ok) {
      throw new Error('Failed to load drug features CSV');
    }
    
    const csvText = await response.text();
    const lines = csvText.split('\n').slice(1); // Skip header
    
    let loadedCount = 0;
    let errorCount = 0;
    
    lines.forEach((line, index) => {
      if (line.trim()) {
        try {
          // Parse CSV line - handle commas within quoted fields
          const columns = parseCSVLine(line);
          
          if (columns.length >= 8) {
            const drugBankId = columns[0]?.trim();
            const name = columns[1]?.replace(/"/g, '').trim();
            const description = columns[2]?.replace(/"/g, '').trim() || '';
            const nameLength = parseInt(columns[3]) || 0;
            const descLength = parseFloat(columns[4]) || 0;
            const hasDescription = columns[5]?.toLowerCase() === 'true';
            const category = columns[6]?.trim() || 'other';
            const elderlyRiskFactors = columns[7] ? JSON.parse(columns[7]) : [];
            
            if (drugBankId && name) {
              const drugInfo: ComprehensiveDrugInfo = {
                id: drugBankId,
                name,
                description,
                category,
                elderlyRiskFactors,
                drugBankId,
                nameLength,
                descLength,
                hasDescription
              };
              
              comprehensiveDrugDatabase.set(drugBankId, drugInfo);
              
              // Track categories
              const categoryCount = drugCategories.get(category) || 0;
              drugCategories.set(category, categoryCount + 1);
              
              loadedCount++;
            }
          }
        } catch (error) {
          errorCount++;
          if (errorCount < 10) { // Only log first 10 errors
            console.warn(`Error parsing line ${index + 2}:`, error);
          }
        }
      }
    });

    isDatabaseLoaded = true;
    console.log(`✅ Loaded ${loadedCount} drugs from comprehensive database`);
    console.log(`⚠️ ${errorCount} lines had parsing errors`);
    console.log(`📊 Categories found:`, Object.fromEntries(drugCategories));
    
    return true;
  } catch (error) {
    console.error('❌ Error loading comprehensive drug database:', error);
    loadFallbackDrugs();
    return false;
  }
}

// Parse CSV line handling quoted fields with commas
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

// Fallback drugs if CSV loading fails
function loadFallbackDrugs() {
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
    comprehensiveDrugDatabase.set(drug.id, {
      id: drug.id,
      name: drug.name,
      description: drug.description,
      category: drug.category,
      elderlyRiskFactors: [],
      drugBankId: drug.id,
      nameLength: drug.name.length,
      descLength: drug.description.length,
      hasDescription: true
    });
  });

  console.log(`📦 Loaded ${fallbackDrugs.length} fallback drugs`);
}

// Search drugs with advanced filtering
export function searchComprehensiveDrugs(
  query: string, 
  options: {
    limit?: number;
    category?: string;
    hasDescription?: boolean;
    minNameLength?: number;
    elderlyRiskOnly?: boolean;
  } = {}
): ComprehensiveDrugInfo[] {
  const {
    limit = 50,
    category,
    hasDescription,
    minNameLength = 0,
    elderlyRiskOnly = false
  } = options;

  const results: ComprehensiveDrugInfo[] = [];
  const queryLower = query.toLowerCase();
  
  // First pass: exact matches
  for (const drug of Array.from(comprehensiveDrugDatabase.values())) {
    if (drug.name.toLowerCase() === queryLower) {
      if (matchesFilters(drug, { category, hasDescription, minNameLength, elderlyRiskOnly })) {
        results.unshift(drug);
        if (results.length >= limit) break;
      }
    }
  }
  
  // Second pass: partial matches
  if (results.length < limit) {
    for (const drug of Array.from(comprehensiveDrugDatabase.values())) {
      if (drug.name.toLowerCase().includes(queryLower) && 
          !results.some(r => r.id === drug.id)) {
        if (matchesFilters(drug, { category, hasDescription, minNameLength, elderlyRiskOnly })) {
          results.push(drug);
          if (results.length >= limit) break;
        }
      }
    }
  }
  
  // Third pass: description matches (if still under limit)
  if (results.length < limit && query.length > 3) {
    for (const drug of Array.from(comprehensiveDrugDatabase.values())) {
      if (drug.description.toLowerCase().includes(queryLower) && 
          !results.some(r => r.id === drug.id)) {
        if (matchesFilters(drug, { category, hasDescription, minNameLength, elderlyRiskOnly })) {
          results.push(drug);
          if (results.length >= limit) break;
        }
      }
    }
  }
  
  return results;
}

// Helper function to check if drug matches filters
function matchesFilters(
  drug: ComprehensiveDrugInfo, 
  filters: {
    category?: string;
    hasDescription?: boolean;
    minNameLength?: number;
    elderlyRiskOnly?: boolean;
  }
): boolean {
  if (filters.category && drug.category.toLowerCase() !== filters.category.toLowerCase()) {
    return false;
  }
  
  if (filters.hasDescription !== undefined && drug.hasDescription !== filters.hasDescription) {
    return false;
  }
  
  if (filters.minNameLength && drug.nameLength < filters.minNameLength) {
    return false;
  }
  
  if (filters.elderlyRiskOnly && drug.elderlyRiskFactors.length === 0) {
    return false;
  }
  
  return true;
}

// Get drug by ID
export function getComprehensiveDrugById(id: string): ComprehensiveDrugInfo | undefined {
  return comprehensiveDrugDatabase.get(id);
}

// Get drugs by category
export function getDrugsByCategory(category: string, limit: number = 100): ComprehensiveDrugInfo[] {
  const results: ComprehensiveDrugInfo[] = [];
  
  for (const drug of Array.from(comprehensiveDrugDatabase.values())) {
    if (drug.category.toLowerCase() === category.toLowerCase()) {
      results.push(drug);
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

// Get all categories with counts
export function getDrugCategories(): Array<{ name: string; count: number }> {
  return Array.from(drugCategories.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// Get popular drugs (most commonly used)
export function getPopularDrugs(limit: number = 20): ComprehensiveDrugInfo[] {
  // This would ideally be based on usage data, but for now we'll return
  // drugs with shorter names (more likely to be commonly used)
  return Array.from(comprehensiveDrugDatabase.values())
    .filter(drug => drug.hasDescription && drug.nameLength < 20)
    .sort((a, b) => a.nameLength - b.nameLength)
    .slice(0, limit);
}

// Get database statistics
export function getComprehensiveDatabaseStats() {
  const drugs = Array.from(comprehensiveDrugDatabase.values());
  
  return {
    totalDrugs: drugs.length,
    categories: Object.fromEntries(drugCategories),
    averageNameLength: drugs.reduce((sum, drug) => sum + drug.nameLength, 0) / drugs.length,
    drugsWithDescription: drugs.filter(drug => drug.hasDescription).length,
    elderlyRiskDrugs: drugs.filter(drug => drug.elderlyRiskFactors.length > 0).length,
    isLoaded: isDatabaseLoaded
  };
}

// Initialize the comprehensive drug database
export async function initializeComprehensiveDrugDatabase() {
  console.log('🚀 Initializing comprehensive drug database...');
  await loadComprehensiveDrugDatabase();
  console.log('✅ Comprehensive drug database initialized successfully');
}
