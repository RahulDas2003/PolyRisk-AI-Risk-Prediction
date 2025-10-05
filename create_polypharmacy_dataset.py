import pandas as pd
import numpy as np
from tqdm import tqdm
import os

def create_stitch_to_drug_mapping():
    """Create mapping from STITCH ID to drug names"""
    print("Creating STITCH ID to drug name mapping...")
    
    # Read chemicals.csv in chunks to handle large file
    chunk_size = 10000
    stitch_to_drug = {}
    
    print("Reading chemicals.csv in chunks...")
    for chunk in tqdm(pd.read_csv('data/processed/chemicals.csv', chunksize=chunk_size), 
                      desc="Processing chunks"):
        for _, row in chunk.iterrows():
            stitch_id = row['chemical']  # This contains STITCH IDs like 'CIDs00000001'
            drug_name = row['name']
            if pd.notna(stitch_id) and pd.notna(drug_name):
                # Convert CIDs format to CID format for matching with TWOSIDES
                if stitch_id.startswith('CIDs'):
                    stitch_id = stitch_id.replace('CIDs', 'CID')
                stitch_to_drug[stitch_id] = drug_name
    
    print(f"Mapped {len(stitch_to_drug)} STITCH IDs to drug names")
    return stitch_to_drug

def load_twosides_data():
    """Load TWOSIDES data"""
    print("\nLoading TWOSIDES data...")
    twosides = pd.read_csv('data/twosides.csv')
    print(f"TWOSIDES shape: {twosides.shape}")
    print(f"TWOSIDES columns: {list(twosides.columns)}")
    print("\nTWOSIDES sample:")
    print(twosides.head())
    return twosides

def create_polypharmacy_dataset(stitch_to_drug, twosides):
    """Create the final polypharmacy dataset with drug names"""
    print("\nCreating polypharmacy dataset...")
    
    output_rows = []
    matched_count = 0
    unmatched_count = 0
    
    for _, row in tqdm(twosides.iterrows(), total=len(twosides), desc="Processing TWOSIDES"):
        stitch1 = row['STITCH 1']
        stitch2 = row['STITCH 2']
        side_effect = row['Side Effect Name']
        
        # Get drug names for both STITCH IDs
        drug1_name = stitch_to_drug.get(stitch1, f"Unknown_Drug_{stitch1}")
        drug2_name = stitch_to_drug.get(stitch2, f"Unknown_Drug_{stitch2}")
        
        # Count matches
        if drug1_name.startswith("Unknown_Drug_") and drug2_name.startswith("Unknown_Drug_"):
            unmatched_count += 1
        else:
            matched_count += 1
        
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
    
    print(f"Dataset created: {output_file}")
    print(f"Total records: {len(final_df)}")
    print(f"Matched records: {matched_count}")
    print(f"Unmatched records: {unmatched_count}")
    print(f"Match rate: {matched_count/len(final_df)*100:.2f}%")
    print(f"Columns: {list(final_df.columns)}")
    
    # Show sample
    print("\nSample data:")
    print(final_df.head(10))
    
    # Show statistics
    print(f"\nStatistics:")
    print(f"- Unique drug1 names: {final_df['drug1'].nunique()}")
    print(f"- Unique drug2 names: {final_df['drug2'].nunique()}")
    print(f"- Unique side effects: {final_df['Polypharmacy Side Effect'].nunique()}")
    
    # Show some matched examples
    matched_examples = final_df[~final_df['drug1'].str.startswith('Unknown_Drug_') & 
                               ~final_df['drug2'].str.startswith('Unknown_Drug_')]
    if len(matched_examples) > 0:
        print(f"\nMatched examples:")
        print(matched_examples.head(5))
    
    return final_df

def main():
    """Main function to run the analysis and dataset creation"""
    print("Starting STITCH ID analysis and polypharmacy dataset creation...")
    
    # Step 1: Create STITCH to drug mapping
    stitch_to_drug = create_stitch_to_drug_mapping()
    
    # Step 2: Load TWOSIDES data
    twosides = load_twosides_data()
    
    # Step 3: Create final dataset
    if stitch_to_drug:
        final_dataset = create_polypharmacy_dataset(stitch_to_drug, twosides)
    else:
        print("No STITCH to drug mapping created. Please check the chemicals.csv structure.")
    
    print("\nAnalysis complete!")

if __name__ == "__main__":
    main()
