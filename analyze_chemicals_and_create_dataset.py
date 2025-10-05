import pandas as pd
import numpy as np
from tqdm import tqdm
import os

def analyze_chemicals_file():
    """Analyze the chemicals.csv file structure and sample data"""
    print("Analyzing chemicals.csv file...")
    
    # Read just the first few rows to understand structure
    sample_df = pd.read_csv('data/processed/chemicals.csv', nrows=5)
    print(f"Sample data shape: {sample_df.shape}")
    print(f"Columns: {list(sample_df.columns)}")
    print("\nSample data:")
    print(sample_df.head())
    
    # Get column info
    print(f"\nColumn info:")
    print(sample_df.info())
    
    return sample_df.columns.tolist()

def create_stitch_to_drug_mapping():
    """Create mapping from STITCH ID to drug names"""
    print("\nCreating STITCH ID to drug name mapping...")
    
    # Read chemicals.csv in chunks to handle large file
    chunk_size = 10000
    stitch_to_drug = {}
    
    print("Reading chemicals.csv in chunks...")
    for chunk in tqdm(pd.read_csv('data/processed/chemicals.csv', chunksize=chunk_size), 
                      desc="Processing chunks"):
        # Assuming the file has columns like 'chemical_id' and 'name' or similar
        # We need to identify the correct column names first
        if 'chemical_id' in chunk.columns and 'name' in chunk.columns:
            for _, row in chunk.iterrows():
                stitch_id = row['chemical_id']
                drug_name = row['name']
                if pd.notna(stitch_id) and pd.notna(drug_name):
                    stitch_to_drug[stitch_id] = drug_name
        else:
            # Try to identify the correct columns
            print(f"Available columns: {list(chunk.columns)}")
            # Look for columns that might contain STITCH IDs and names
            for col in chunk.columns:
                if 'id' in col.lower() or 'stitch' in col.lower():
                    print(f"Potential ID column: {col}")
                if 'name' in col.lower() or 'compound' in col.lower():
                    print(f"Potential name column: {col}")
            break  # Just analyze first chunk for column identification
    
    print(f"✅ Mapped {len(stitch_to_drug)} STITCH IDs to drug names")
    return stitch_to_drug

def load_twosides_data():
    """Load TWOSIDES data"""
    print("\n📊 Loading TWOSIDES data...")
    twosides = pd.read_csv('data/twosides.csv')
    print(f"📈 TWOSIDES shape: {twosides.shape}")
    print(f"📋 TWOSIDES columns: {list(twosides.columns)}")
    print("\n📄 TWOSIDES sample:")
    print(twosides.head())
    return twosides

def create_polypharmacy_dataset(stitch_to_drug, twosides):
    """Create the final polypharmacy dataset with drug names"""
    print("\n🏗️ Creating polypharmacy dataset...")
    
    output_rows = []
    
    for _, row in tqdm(twosides.iterrows(), total=len(twosides), desc="Processing TWOSIDES"):
        stitch1 = row['STITCH 1']
        stitch2 = row['STITCH 2']
        side_effect = row['Side Effect Name']
        
        # Get drug names for both STITCH IDs
        drug1_name = stitch_to_drug.get(stitch1, f"Unknown_Drug_{stitch1}")
        drug2_name = stitch_to_drug.get(stitch2, f"Unknown_Drug_{stitch2}")
        
        # Create the output row
        output_rows.append({
            'drug1': drug1_name,
            'drug2': drug2_name,
            'Polypharmacy Side Effect': side_effect,
            'Side Effect Name': f"{drug1_name} and {drug2_name}: {side_effect}"
        })
    
    # Create DataFrame
    final_df = pd.DataFrame(output_rows)
    
    # Save to file
    output_file = 'data/processed/polypharmacy_side_effects_dataset.csv'
    final_df.to_csv(output_file, index=False)
    
    print(f"✅ Dataset created: {output_file}")
    print(f"📊 Total records: {len(final_df)}")
    print(f"📋 Columns: {list(final_df.columns)}")
    
    # Show sample
    print("\n📄 Sample data:")
    print(final_df.head(10))
    
    # Show statistics
    print(f"\n📈 Statistics:")
    print(f"- Unique drug1 names: {final_df['drug1'].nunique()}")
    print(f"- Unique drug2 names: {final_df['drug2'].nunique()}")
    print(f"- Unique side effects: {final_df['Polypharmacy Side Effect'].nunique()}")
    
    return final_df

def main():
    """Main function to run the analysis and dataset creation"""
    print("🚀 Starting STITCH ID analysis and polypharmacy dataset creation...")
    
    # Step 1: Analyze chemicals.csv structure
    columns = analyze_chemicals_file()
    
    # Step 2: Create STITCH to drug mapping
    stitch_to_drug = create_stitch_to_drug_mapping()
    
    # Step 3: Load TWOSIDES data
    twosides = load_twosides_data()
    
    # Step 4: Create final dataset
    if stitch_to_drug:
        final_dataset = create_polypharmacy_dataset(stitch_to_drug, twosides)
    else:
        print("❌ No STITCH to drug mapping created. Please check the chemicals.csv structure.")
    
    print("\n✅ Analysis complete!")

if __name__ == "__main__":
    main()
