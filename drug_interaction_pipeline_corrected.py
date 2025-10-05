import pandas as pd
from tqdm import tqdm
from itertools import combinations
import difflib
import os

# Create processed directory if it doesn't exist
os.makedirs("data/processed", exist_ok=True)

# Load datasets with correct paths
print("Loading datasets...")
drugbank = pd.read_csv('data/processed/drugbank_filtered.csv')
sider = pd.read_csv('data/sider.csv')
twosides = pd.read_csv('data/twosides.csv')

print(f"DrugBank: {len(drugbank)} drugs")
print(f"SIDER: {len(sider)} records")
print(f"TWOSIDES: {len(twosides)} records")

print("\nDataset previews:")
print("DrugBank head:")
print(drugbank.head())
print("\nSIDER head:")
print(sider.head())
print("\nTWOSIDES head:")
print(twosides.head())

# Step 1: Build DrugBank → STITCH mapping
print("\n" + "="*50)
print("Step 1: Building DrugBank → STITCH mapping")
print("="*50)

# Placeholder for mapping file
# Example: mapping = pd.read_csv('data/processed/drugbank_stitch_mapping.csv')
mapping = None

if mapping is not None:
    drug_to_stitch = dict(zip(mapping['DrugBank ID'], mapping['STITCH_ID']))
    print(f"Loaded {len(drug_to_stitch)} mappings from file")
else:
    # fallback: use fuzzy name matching with SIDER STITCH names
    sider_drugs = sider[['STITCH_compound_ID_flat']].drop_duplicates()
    drug_to_stitch = {}
    for _, row in tqdm(drugbank.iterrows(), total=len(drugbank), desc="Building mappings"):
        name = row['Name']
        # Here we only demonstrate placeholder: ideally use external name dictionaries
        # For now, we map nothing (to be replaced by your mapping method)
        drug_to_stitch[row['DrugBank ID']] = None

print(f"Total mappings: {len(drug_to_stitch)}")

# Step 2: Integrate SIDER side effects per drug
print("\n" + "="*50)
print("Step 2: Integrating SIDER side effects")
print("="*50)

sider_map = {}
for _, row in tqdm(sider.iterrows(), total=len(sider), desc="Processing SIDER"):
    stitch_id = row['STITCH_compound_ID_flat']
    se = row['MedDRA_term']
    if pd.notna(stitch_id) and pd.notna(se):
        sider_map.setdefault(stitch_id, set()).add(se)

print(f"SIDER side effects mapped for {len(sider_map)} drugs")

# Step 3: Integrate TWOSIDES side effects per drug pair
print("\n" + "="*50)
print("Step 3: Integrating TWOSIDES side effects")
print("="*50)

twosides_map = {}
for _, row in tqdm(twosides.iterrows(), total=len(twosides), desc="Processing TWOSIDES"):
    d1, d2, se = row['STITCH 1'], row['STITCH 2'], row['Side Effect Name']
    key = tuple(sorted([d1, d2]))
    if pd.notna(se):
        twosides_map.setdefault(key, set()).add(se)

print(f"TWOSIDES side effects mapped for {len(twosides_map)} drug pairs")

# Step 4: Build final annotated dataset
print("\n" + "="*50)
print("Step 4: Building final annotated dataset")
print("="*50)

output_rows = []
drug_names = drugbank[['DrugBank ID','Name']]

# Only iterate subset for demonstration (all pairs is too large)
subset = drug_names.head(100)
print(f"Processing {len(subset)} drugs (subset for demonstration)")

for (id1, name1), (id2, name2) in tqdm(combinations(zip(subset['DrugBank ID'], subset['Name']), 2), 
                                       desc="Building drug pairs"):
    s1, s2 = drug_to_stitch.get(id1), drug_to_stitch.get(id2)
    se_list = set()
    notes = []
    
    if s1 in sider_map:
        se_list |= sider_map[s1]
        notes.append('sider_individual_SEs')
    if s2 in sider_map:
        se_list |= sider_map[s2]
        notes.append('sider_individual_SEs')
    if s1 and s2:
        key = tuple(sorted([s1, s2]))
        if key in twosides_map:
            se_list |= twosides_map[key]
            notes.append('twosides_pair_signals')
    
    output_rows.append({
        'drug1': name1,
        'drug2': name2,
        'possible_interactions': ';'.join(set(notes)),
        'sideeffects': '|'.join(set(se_list))
    })

final_df = pd.DataFrame(output_rows)
output_file = 'data/processed/drug_interactions_annotated.csv'
final_df.to_csv(output_file, index=False)

print(f"\n✅ Final dataset created: {output_file}")
print(f"Total drug pairs: {len(final_df)}")
print(f"Columns: {list(final_df.columns)}")
print("\nFirst 5 rows:")
print(final_df.head())

print(f"\n📊 Summary:")
print(f"- Drug pairs with SIDER data: {len(final_df[final_df['possible_interactions'].str.contains('sider_individual_SEs', na=False)])}")
print(f"- Drug pairs with TWOSIDES data: {len(final_df[final_df['possible_interactions'].str.contains('twosides_pair_signals', na=False)])}")
print(f"- Drug pairs with any side effects: {len(final_df[final_df['sideeffects'] != ''])}")
