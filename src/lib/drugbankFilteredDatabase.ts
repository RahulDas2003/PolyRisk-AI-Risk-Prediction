// DrugBank Filtered Database - Simplified drug database with 17,430 drugs
// Uses drugbank_filtered.csv for faster loading and better performance

export interface DrugBankDrug {
  id: string;
  name: string;
  drugBankId: string;
}

// In-memory drug database
let drugDatabase: Map<string, DrugBankDrug> = new Map();
let isDatabaseLoaded = false;

// Load DrugBank filtered database
export async function loadDrugBankFilteredDatabase(): Promise<boolean> {
  if (isDatabaseLoaded) {
    return true;
  }

  try {
    console.log('🔄 Loading DrugBank filtered database (17,430 drugs)...');
    
    const response = await fetch('/data/processed/drugbank_filtered.csv');
    if (!response.ok) {
      throw new Error('Failed to load DrugBank filtered database');
    }
    
    const csvText = await response.text();
    const lines = csvText.split('\n');
    
    // Skip header line
    const dataLines = lines.slice(1);
    
    let loadedCount = 0;
    let errorCount = 0;
    
    dataLines.forEach((line, index) => {
      if (line.trim()) {
        try {
          // Handle CSV parsing more carefully
          const columns = line.split(',').map(col => col.trim());
          if (columns.length >= 2) {
            const drugBankId = columns[0];
            const name = columns[1];
            
            if (drugBankId && name) {
              const drug: DrugBankDrug = {
                id: drugBankId, // Use DrugBank ID as the unique identifier
                name: name.replace(/"/g, ''), // Remove quotes
                drugBankId: drugBankId
              };
              
              drugDatabase.set(drugBankId, drug);
              loadedCount++;
            }
          }
        } catch (error) {
          errorCount++;
          if (errorCount < 10) {
            console.warn(`Error parsing drug line ${index + 2}:`, error);
          }
        }
      }
    });

    isDatabaseLoaded = true;
    console.log(`✅ DrugBank filtered database loaded: ${loadedCount} drugs`);
    console.log(`⚠️ ${errorCount} lines had parsing errors`);
    
    
    return true;
  } catch (error) {
    console.error('❌ Error loading DrugBank filtered database:', error);
    return false;
  }
}

// Search drugs by name
export function searchDrugBankDrugs(
  query: string, 
  options: {
    limit?: number;
    exactMatch?: boolean;
  } = {}
): DrugBankDrug[] {
  const { limit = 20, exactMatch = false } = options;
  
  if (!isDatabaseLoaded || !query.trim()) {
    return [];
  }

  const results: DrugBankDrug[] = [];
  const queryLower = query.toLowerCase().trim();
  
  // Convert Map values to array for iteration
  const allDrugs = Array.from(drugDatabase.values());
  
  // First pass: exact matches (highest priority)
  if (exactMatch) {
    for (const drug of allDrugs) {
      if (drug.name.toLowerCase() === queryLower) {
        results.push(drug);
        if (results.length >= limit) break;
      }
    }
  } else {
    // First pass: exact matches (highest priority)
    for (const drug of allDrugs) {
      if (drug.name.toLowerCase() === queryLower) {
        results.push(drug);
        if (results.length >= limit) break;
      }
    }
    
    // Second pass: starts with query (high priority)
    if (results.length < limit) {
      for (const drug of allDrugs) {
        if (drug.name.toLowerCase().startsWith(queryLower) && 
            !results.some(r => r.id === drug.id)) {
          results.push(drug);
          if (results.length >= limit) break;
        }
      }
    }
    
    // Third pass: contains query (medium priority)
    if (results.length < limit) {
      for (const drug of allDrugs) {
        if (drug.name.toLowerCase().includes(queryLower) && 
            !results.some(r => r.id === drug.id)) {
          results.push(drug);
          if (results.length >= limit) break;
        }
      }
    }
  }
  
  return results;
}

// Get drug by DrugBank ID
export function getDrugBankDrugById(id: string): DrugBankDrug | undefined {
  return drugDatabase.get(id);
}

// Get drug by name (exact match)
export function getDrugBankDrugByName(name: string): DrugBankDrug | undefined {
  const allDrugs = Array.from(drugDatabase.values());
  for (const drug of allDrugs) {
    if (drug.name.toLowerCase() === name.toLowerCase()) {
      return drug;
    }
  }
  return undefined;
}

// Get database statistics
export function getDrugBankDatabaseStats() {
  return {
    totalDrugs: drugDatabase.size,
    isLoaded: isDatabaseLoaded,
    databaseName: 'DrugBank Filtered'
  };
}

// Initialize the database
export async function initializeDrugBankDatabase(): Promise<boolean> {
  console.log('🚀 Initializing DrugBank filtered database...');
  const success = await loadDrugBankFilteredDatabase();
  if (success) {
    console.log('✅ DrugBank filtered database initialized successfully');
  } else {
    console.log('❌ DrugBank filtered database initialization failed');
  }
  return success;
}

// Check if database is loaded
export function isDrugBankDatabaseLoaded(): boolean {
  return isDatabaseLoaded;
}

// Get all drugs (for debugging)
export function getAllDrugBankDrugs(): DrugBankDrug[] {
  return Array.from(drugDatabase.values());
}

// Search with advanced options
export function searchDrugBankDrugsAdvanced(
  query: string,
  options: {
    limit?: number;
    includePartialMatches?: boolean;
    caseSensitive?: boolean;
  } = {}
): DrugBankDrug[] {
  const { 
    limit = 20, 
    includePartialMatches = true, 
    caseSensitive = false 
  } = options;
  
  if (!isDatabaseLoaded || !query.trim()) {
    return [];
  }

  const results: DrugBankDrug[] = [];
  const searchQuery = caseSensitive ? query.trim() : query.toLowerCase().trim();
  const allDrugs = Array.from(drugDatabase.values());
  
  for (const drug of allDrugs) {
    const drugName = caseSensitive ? drug.name : drug.name.toLowerCase();
    
    // Exact match (highest priority)
    if (drugName === searchQuery) {
      results.unshift(drug); // Add to beginning for highest priority
    }
    // Starts with query (high priority)
    else if (drugName.startsWith(searchQuery)) {
      results.push(drug);
    }
    // Contains query (medium priority) - only if includePartialMatches is true
    else if (includePartialMatches && drugName.includes(searchQuery)) {
      results.push(drug);
    }
    
    if (results.length >= limit) break;
  }
  
  return results.slice(0, limit);
}
