import pandas as pd
import os
from tqdm import tqdm

def fix_chemicals_format():
    """Fix the STITCH ID format in chemicals.csv by removing the 's' from CIDs"""
    print("Fixing STITCH ID format in chemicals.csv...")
    
    input_file = 'data/processed/chemicals.csv'
    output_file = 'data/processed/chemicals_fixed.csv'
    
    # Check if file exists
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found!")
        return
    
    print(f"Reading {input_file}...")
    
    # Read the file in chunks to handle large size
    chunk_size = 10000
    fixed_chunks = []
    
    for chunk in tqdm(pd.read_csv(input_file, chunksize=chunk_size), desc="Processing chunks"):
        # Fix the chemical column by removing 's' from CIDs
        if 'chemical' in chunk.columns:
            chunk['chemical'] = chunk['chemical'].str.replace('CIDs', 'CID', regex=False)
            fixed_chunks.append(chunk)
        else:
            print("Warning: 'chemical' column not found in chunk")
            fixed_chunks.append(chunk)
    
    # Combine all chunks
    print("Combining fixed chunks...")
    fixed_df = pd.concat(fixed_chunks, ignore_index=True)
    
    # Save the fixed file
    print(f"Saving fixed file to {output_file}...")
    fixed_df.to_csv(output_file, index=False)
    
    print(f"✅ Fixed file saved: {output_file}")
    print(f"Total records: {len(fixed_df)}")
    
    # Show sample of fixed data
    print("\nSample of fixed data:")
    print(fixed_df[['chemical', 'name']].head(10))
    
    # Check for any remaining CIDs with 's'
    remaining_s = fixed_df['chemical'].str.contains('CIDs', na=False).sum()
    print(f"\nRemaining CIDs with 's': {remaining_s}")
    
    if remaining_s == 0:
        print("✅ All CIDs successfully converted to CID format!")
    else:
        print("⚠️ Some CIDs still contain 's' - check the data")
    
    return fixed_df

def verify_twosides_format():
    """Verify the format of STITCH IDs in TWOSIDES.csv"""
    print("\nVerifying TWOSIDES.csv format...")
    
    twosides = pd.read_csv('data/twosides.csv', nrows=10)
    print("Sample STITCH IDs from TWOSIDES:")
    print(twosides[['STITCH 1', 'STITCH 2']].head())
    
    # Check if they start with CID (without s)
    stitch1_format = twosides['STITCH 1'].str.startswith('CID').all()
    stitch2_format = twosides['STITCH 2'].str.startswith('CID').all()
    
    print(f"STITCH 1 format correct (starts with CID): {stitch1_format}")
    print(f"STITCH 2 format correct (starts with CID): {stitch2_format}")

def main():
    """Main function"""
    print("Starting STITCH ID format fix...")
    
    # Step 1: Verify TWOSIDES format
    verify_twosides_format()
    
    # Step 2: Fix chemicals.csv format
    fixed_df = fix_chemicals_format()
    
    print("\n✅ Format fix complete!")
    print("Now you can run the polypharmacy dataset creation again with the fixed format.")

if __name__ == "__main__":
    main()
