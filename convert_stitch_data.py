import pandas as pd
import gzip
import os

# Check if the STITCH file exists in the data directory
input_path = "data/chemicals.v5.0.tsv.gz"
output_path = "data/processed/chemicals.csv"

# Create the processed directory if it doesn't exist
os.makedirs("data/processed", exist_ok=True)

# Check if input file exists
if not os.path.exists(input_path):
    print(f"❌ Input file not found: {input_path}")
    print("Please ensure the STITCH file is in the data/ directory")
    print("Expected file: data/chemicals.v5.0.tsv.gz")
    exit(1)

try:
    # Read the .gz-compressed TSV file
    with gzip.open(input_path, "rt") as f:
        df = pd.read_csv(f, sep="\t")
    
    # Save as CSV
    df.to_csv(output_path, index=False)
    
    print(f"✅ Conversion complete! Saved as {output_path}")
    print(f"Total rows: {len(df)}")
    print(f"Columns: {list(df.columns)}")
    
except FileNotFoundError:
    print(f"❌ File not found: {input_path}")
    print("Please check if the STITCH file exists in the data/ directory")
except Exception as e:
    print(f"❌ Error during conversion: {str(e)}")
