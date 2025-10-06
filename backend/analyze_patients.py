#!/usr/bin/env python3
"""
PolyRisk AI - Patient Risk Analysis Script
Analyzes patient data from patient_data.json using risk scoring criteria
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Any

def load_patient_data(file_path: str = 'patient_data.json') -> List[Dict[str, Any]]:
    """Load patient data from JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data.get('patients', [])
    except FileNotFoundError:
        print(f"Error: {file_path} not found")
        return []
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return []

def calculate_risk_score(patient_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate risk score based on age and organ function
    Following exact criteria:
    - Age 60-70: +1, Age 70-80: +2, Age 80+: +3
    - Kidney impairment: +1
    - Liver impairment: +1
    """
    age = patient_data.get('age', 0)
    kidney_function = patient_data.get('kidney_function', 'normal').lower()
    liver_function = patient_data.get('liver_function', 'normal').lower()
    
    # Age risk calculation
    age_risk = 0
    if 60 <= age < 70:
        age_risk = 1
    elif 70 <= age < 80:
        age_risk = 2
    elif age >= 80:
        age_risk = 3
    
    # Organ function risk calculation
    kidney_risk = 1 if kidney_function != 'normal' else 0
    liver_risk = 1 if liver_function != 'normal' else 0
    
    base_score = age_risk + kidney_risk + liver_risk
    
    # Risk level determination
    if base_score <= 4:
        risk_level = 'low'
    elif base_score <= 6:
        risk_level = 'moderate'
    else:
        risk_level = 'high'
    
    return {
        'age_risk': age_risk,
        'kidney_risk': kidney_risk,
        'liver_risk': liver_risk,
        'base_score': base_score,
        'risk_level': risk_level,
        'total_medications': len(patient_data.get('medications', [])),
        'polypharmacy_risk': len(patient_data.get('medications', [])) >= 5
    }

def format_medication_list(medications: List[Dict[str, Any]]) -> str:
    """Format medication list for display"""
    if not medications:
        return "None"
    
    return ", ".join([f"{med['name']} ({med['dose']} {med['frequency']})" for med in medications])

def analyze_all_patients(file_path: str = 'patient_data.json') -> List[Dict[str, Any]]:
    """Analyze all patients and generate comprehensive report"""
    patients = load_patient_data(file_path)
    
    if not patients:
        print("No patient data found")
        return []
    
    print("\n" + "="*80)
    print("POLYRISK AI - COMPREHENSIVE PATIENT RISK ANALYSIS")
    print("="*80)
    print(f"Analysis Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Total Patients: {len(patients)}")
    print("="*80 + "\n")
    
    results = []
    
    for i, patient_record in enumerate(patients, 1):
        patient_data = patient_record['data']['patient_data']
        patient_id = patient_record.get('id', f'patient_{i}')
        
        print(f"{'-'*80}")
        print(f"Patient {i}/{len(patients)} - {patient_data.get('patient_name', 'Unknown')}")
        print(f"ID: {patient_id}")
        print(f"{'-'*80}")
        
        # Basic patient info
        print(f"Demographics:")
        print(f"   - Age: {patient_data.get('age', 'Unknown')} years")
        print(f"   - Gender: {patient_data.get('gender', 'Unknown')}")
        print(f"   - Kidney Function: {patient_data.get('kidney_function', 'Unknown')}")
        print(f"   - Liver Function: {patient_data.get('liver_function', 'Unknown')}")
        
        # Medications
        medications = patient_data.get('medications', [])
        print(f"\nCurrent Medications ({len(medications)}):")
        for j, med in enumerate(medications, 1):
            print(f"   {j}. {med.get('name', 'Unknown')} - {med.get('dose', 'Unknown')} {med.get('frequency', 'Unknown')}")
        
        # Risk analysis
        risk_analysis = calculate_risk_score(patient_data)
        
        print(f"\nRisk Score Analysis:")
        print(f"   - Age Risk: {risk_analysis['age_risk']} points")
        print(f"   - Kidney Risk: {risk_analysis['kidney_risk']} points")
        print(f"   - Liver Risk: {risk_analysis['liver_risk']} points")
        print(f"   - Base Score: {risk_analysis['base_score']}/10")
        print(f"   - Risk Level: {risk_analysis['risk_level'].upper()}")
        print(f"   - Polypharmacy Risk: {'Yes' if risk_analysis['polypharmacy_risk'] else 'No'}")
        
        # Clinical notes
        clinical_notes = patient_data.get('clinical_notes', '')
        if clinical_notes:
            print(f"\nClinical Notes:")
            print(f"   {clinical_notes}")
        
        print()
        
        # Store results
        results.append({
            'patient_id': patient_id,
            'patient_name': patient_data.get('patient_name', 'Unknown'),
            'age': patient_data.get('age', 0),
            'gender': patient_data.get('gender', 'Unknown'),
            'kidney_function': patient_data.get('kidney_function', 'Unknown'),
            'liver_function': patient_data.get('liver_function', 'Unknown'),
            'medications': medications,
            'risk_analysis': risk_analysis,
            'analysis_timestamp': datetime.now().isoformat()
        })
    
    # Summary statistics
    print("="*80)
    print("ANALYSIS SUMMARY")
    print("="*80)
    
    total_patients = len(results)
    low_risk = sum(1 for r in results if r['risk_analysis']['risk_level'] == 'low')
    moderate_risk = sum(1 for r in results if r['risk_analysis']['risk_level'] == 'moderate')
    high_risk = sum(1 for r in results if r['risk_analysis']['risk_level'] == 'high')
    polypharmacy_patients = sum(1 for r in results if r['risk_analysis']['polypharmacy_risk'])
    
    print(f"Total Patients Analyzed: {total_patients}")
    print(f"Low Risk (<=4 points): {low_risk} ({low_risk/total_patients*100:.1f}%)")
    print(f"Moderate Risk (5-6 points): {moderate_risk} ({moderate_risk/total_patients*100:.1f}%)")
    print(f"High Risk (>6 points): {high_risk} ({high_risk/total_patients*100:.1f}%)")
    print(f"Polypharmacy Risk (5+ medications): {polypharmacy_patients} ({polypharmacy_patients/total_patients*100:.1f}%)")
    
    # Age distribution
    age_groups = {
        'Under 60': sum(1 for r in results if r['age'] < 60),
        '60-69': sum(1 for r in results if 60 <= r['age'] < 70),
        '70-79': sum(1 for r in results if 70 <= r['age'] < 80),
        '80+': sum(1 for r in results if r['age'] >= 80)
    }
    
    print(f"\nAge Distribution:")
    for group, count in age_groups.items():
        print(f"   {group}: {count} patients")
    
    # Organ function distribution
    kidney_impairment = sum(1 for r in results if r['kidney_function'].lower() != 'normal')
    liver_impairment = sum(1 for r in results if r['liver_function'].lower() != 'normal')
    
    print(f"\nOrgan Function Status:")
    print(f"   Kidney Impairment: {kidney_impairment} patients ({kidney_impairment/total_patients*100:.1f}%)")
    print(f"   Liver Impairment: {liver_impairment} patients ({liver_impairment/total_patients*100:.1f}%)")
    
    print("="*80 + "\n")
    
    # Save results to file
    output_file = f"patient_analysis_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"Results saved to: {output_file}")
    except Exception as e:
        print(f"Error saving results: {e}")
    
    return results

def main():
    """Main function to run the analysis"""
    print("Starting PolyRisk AI Patient Analysis...")
    
    # Check if patient_data.json exists
    if not os.path.exists('patient_data.json'):
        print("Error: patient_data.json not found in current directory")
        print("Please ensure the file exists and run the script from the backend directory")
        return
    
    try:
        results = analyze_all_patients()
        if results:
            print(f"Analysis complete! Processed {len(results)} patients.")
        else:
            print("No patients were processed.")
    except Exception as e:
        print(f"Error during analysis: {e}")

if __name__ == "__main__":
    main()