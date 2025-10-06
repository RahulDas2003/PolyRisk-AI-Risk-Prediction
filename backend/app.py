from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
import json
import random

app = Flask(__name__)
CORS(app)

# Load or create mock models
# Mock models for demo - no actual ML models needed for this demo
print("Using mock models for demo...")

# Mock drug database
DRUG_DATABASE = {
    'Warfarin': {'category': 'Anticoagulant', 'interactions': ['Aspirin', 'NSAIDs', 'Antibiotics']},
    'Aspirin': {'category': 'NSAID', 'interactions': ['Warfarin', 'NSAIDs', 'ACE Inhibitors']},
    'Metformin': {'category': 'Antidiabetic', 'interactions': ['Contrast Media', 'Alcohol']},
    'Lisinopril': {'category': 'ACE Inhibitor', 'interactions': ['Potassium', 'NSAIDs', 'Diuretics']},
    'Furosemide': {'category': 'Diuretic', 'interactions': ['Digoxin', 'ACE Inhibitors', 'Potassium']},
    'Digoxin': {'category': 'Cardiac Glycoside', 'interactions': ['Furosemide', 'Amiodarone', 'Verapamil']},
    'Atorvastatin': {'category': 'Statin', 'interactions': ['Grapefruit', 'Warfarin']},
    'Omeprazole': {'category': 'PPI', 'interactions': ['Warfarin', 'Clopidogrel']},
    'Insulin': {'category': 'Antidiabetic', 'interactions': ['Alcohol', 'Beta-blockers']},
    'Amlodipine': {'category': 'Calcium Channel Blocker', 'interactions': ['Grapefruit', 'Beta-blockers']}
}

def calculate_risk_score(patient_data, medications):
    """Calculate risk score based on patient data and medications"""
    base_score = 0
    
    # Age factor
    age = patient_data.get('age', 65)
    if age >= 80:
        base_score += 30
    elif age >= 75:
        base_score += 20
    elif age >= 70:
        base_score += 10
    
    # Organ function factors
    kidney_function = patient_data.get('kidneyFunction', 'normal')
    liver_function = patient_data.get('liverFunction', 'normal')
    
    if kidney_function == 'severe':
        base_score += 25
    elif kidney_function == 'moderate':
        base_score += 15
    elif kidney_function == 'mild':
        base_score += 5
        
    if liver_function == 'severe':
        base_score += 25
    elif liver_function == 'moderate':
        base_score += 15
    elif liver_function == 'mild':
        base_score += 5
    
    # Polypharmacy factor
    num_medications = len(medications)
    if num_medications >= 8:
        base_score += 30
    elif num_medications >= 6:
        base_score += 20
    elif num_medications >= 4:
        base_score += 10
    
    # Drug interaction factors
    interaction_score = 0
    for i, med1 in enumerate(medications):
        for j, med2 in enumerate(medications[i+1:], i+1):
            med1_name = med1.get('name', '')
            med2_name = med2.get('name', '')
            
            # Check for known interactions
            if med1_name in DRUG_DATABASE and med2_name in DRUG_DATABASE:
                if med2_name in DRUG_DATABASE[med1_name]['interactions']:
                    interaction_score += 15
                elif med1_name in DRUG_DATABASE[med2_name]['interactions']:
                    interaction_score += 15
    
    # Add some randomness for demo purposes
    random_factor = random.randint(-5, 10)
    total_score = min(base_score + interaction_score + random_factor, 100)
    return max(total_score, 0)

def generate_interactions(medications):
    """Generate mock drug interactions"""
    interactions = []
    
    for i, med1 in enumerate(medications):
        for j, med2 in enumerate(medications[i+1:], i+1):
            med1_name = med1.get('name', '')
            med2_name = med2.get('name', '')
            
            if med1_name in DRUG_DATABASE and med2_name in DRUG_DATABASE:
                if med2_name in DRUG_DATABASE[med1_name]['interactions']:
                    interactions.append({
                        'drugs': f'{med1_name} + {med2_name}',
                        'severity': 'High' if np.random.random() > 0.5 else 'Moderate',
                        'description': f'Potential interaction between {med1_name} and {med2_name}',
                        'management': 'Monitor closely and consider dose adjustment',
                        'alternatives': ['Alternative drug 1', 'Alternative drug 2']
                    })
    
    return interactions[:3]  # Return max 3 interactions

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/drugs', methods=['GET'])
def get_drugs():
    """Get list of available drugs"""
    search_term = request.args.get('search', '').lower()
    
    if search_term:
        filtered_drugs = [
            {'name': name, 'category': data['category']}
            for name, data in DRUG_DATABASE.items()
            if search_term in name.lower()
        ]
    else:
        filtered_drugs = [
            {'name': name, 'category': data['category']}
            for name, data in DRUG_DATABASE.items()
        ]
    
    return jsonify(filtered_drugs)

@app.route('/api/analyze', methods=['POST'])
def analyze_patient():
    """Analyze patient data and predict drug interactions"""
    try:
        data = request.get_json()
        
        patient_data = data.get('patientData', {})
        medications = data.get('medications', [])
        
        # Calculate risk score
        risk_score = calculate_risk_score(patient_data, medications)
        
        # Generate interactions
        interactions = generate_interactions(medications)
        
        # Generate recommendations
        recommendations = [
            'Monitor INR levels weekly',
            'Consider dose adjustment for high-risk medications',
            'Schedule follow-up in 2 weeks',
            'Review medication list for deprescribing opportunities'
        ]
        
        # Generate alternatives
        alternatives = [
            {
                'drug': 'Safer Alternative 1',
                'advantages': ['Lower interaction risk', 'Better tolerability'],
                'disadvantages': ['Higher cost', 'Less evidence'],
                'recommendation': 'Consider for high-risk patients'
            },
            {
                'drug': 'Safer Alternative 2',
                'advantages': ['Proven efficacy', 'Good safety profile'],
                'disadvantages': ['More frequent dosing'],
                'recommendation': 'First-line option for elderly patients'
            }
        ]
        
        # Generate monitoring parameters
        monitoring = [
            {'parameter': 'INR', 'frequency': 'Weekly', 'target': '2.0-3.0', 'critical': '>4.0'},
            {'parameter': 'Creatinine', 'frequency': 'Monthly', 'target': '<1.5 mg/dL', 'critical': '>2.0 mg/dL'},
            {'parameter': 'Potassium', 'frequency': 'Bi-weekly', 'target': '3.5-5.0 mEq/L', 'critical': '<3.0 or >5.5 mEq/L'}
        ]
        
        # Generate elderly care recommendations
        elderly_care = [
            'Start with lowest effective dose',
            'Monitor for falls and cognitive changes',
            'Consider pill burden and adherence',
            'Regular medication review every 3 months',
            'Assess for deprescribing opportunities'
        ]
        
        result = {
            'riskScore': risk_score,
            'riskLevel': 'Low' if risk_score < 25 else 'Moderate' if risk_score < 50 else 'High' if risk_score < 75 else 'Severe',
            'interactions': interactions,
            'alternatives': alternatives,
            'monitoring': monitoring,
            'elderlyCare': elderly_care,
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reports', methods=['GET'])
def get_reports():
    """Get list of analysis reports"""
    # Mock reports data
    reports = [
        {
            'id': '1',
            'patientName': 'John Smith',
            'age': 72,
            'riskScore': 45,
            'riskLevel': 'Moderate',
            'date': '2024-01-15',
            'status': 'completed',
            'interactions': 3,
            'medications': 6
        },
        {
            'id': '2',
            'patientName': 'Mary Johnson',
            'age': 68,
            'riskScore': 78,
            'riskLevel': 'High',
            'date': '2024-01-14',
            'status': 'completed',
            'interactions': 5,
            'medications': 8
        }
    ]
    
    return jsonify(reports)

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get dashboard statistics"""
    stats = {
        'modelAccuracy': 95.2,
        'highRiskPatients': 23.1,
        'totalAnalyses': 12847,
        'avgRiskScore': 34.2,
        'riskDistribution': [
            {'name': 'Low Risk', 'value': 45, 'color': '#10b981'},
            {'name': 'Moderate Risk', 'value': 30, 'color': '#f59e0b'},
            {'name': 'High Risk', 'value': 20, 'color': '#ef4444'},
            {'name': 'Severe Risk', 'value': 5, 'color': '#dc2626'}
        ],
        'ageGroupData': [
            {'ageGroup': '65-70', 'low': 20, 'moderate': 15, 'high': 8, 'severe': 2},
            {'ageGroup': '71-75', 'low': 18, 'moderate': 12, 'high': 10, 'severe': 3},
            {'ageGroup': '76-80', 'low': 15, 'moderate': 18, 'high': 12, 'severe': 4},
            {'ageGroup': '81-85', 'low': 12, 'moderate': 20, 'high': 15, 'severe': 6},
            {'ageGroup': '86+', 'low': 8, 'moderate': 16, 'high': 18, 'severe': 8}
        ],
        'monthlyTrends': [
            {'month': 'Jan', 'interactions': 120},
            {'month': 'Feb', 'interactions': 135},
            {'month': 'Mar', 'interactions': 150},
            {'month': 'Apr', 'interactions': 142},
            {'month': 'May', 'interactions': 168},
            {'month': 'Jun', 'interactions': 175}
        ]
    }
    
    return jsonify(stats)

if __name__ == '__main__':
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
