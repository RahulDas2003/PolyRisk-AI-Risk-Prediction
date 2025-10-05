#!/usr/bin/env python3
"""
Test script to verify both APIs are working
"""

import requests
import json
import time

def test_apis():
    """Test both APIs"""
    print("Testing PolyRisk AI APIs...")
    print("=" * 50)
    
    # Test main API
    try:
        print("Testing Main API (Port 8000)...")
        response = requests.get("http://localhost:8000/api/health", timeout=5)
        if response.status_code == 200:
            print("SUCCESS: Main API is running")
            print(f"   Response: {response.json()}")
        else:
            print(f"ERROR: Main API error: {response.status_code}")
    except Exception as e:
        print(f"ERROR: Main API not accessible: {e}")
    
    print()
    
    # Test analytics API
    try:
        print("Testing Analytics API (Port 8001)...")
        response = requests.get("http://localhost:8001/api/health", timeout=5)
        if response.status_code == 200:
            print("SUCCESS: Analytics API is running")
            print(f"   Response: {response.json()}")
        else:
            print(f"ERROR: Analytics API error: {response.status_code}")
    except Exception as e:
        print(f"ERROR: Analytics API not accessible: {e}")
    
    print()
    
    # Test model accuracy endpoint
    try:
        print("Testing Model Accuracy...")
        response = requests.get("http://localhost:8001/api/model-accuracy", timeout=5)
        if response.status_code == 200:
            data = response.json()
            accuracy = data['data']['model_accuracy']
            print(f"SUCCESS: Model Accuracy: {accuracy:.1%}")
            print(f"   Confidence: {data['data']['confidence_level']}")
        else:
            print(f"ERROR: Model Accuracy error: {response.status_code}")
    except Exception as e:
        print(f"ERROR: Model Accuracy not accessible: {e}")
    
    print()
    
    # Test live analytics
    try:
        print("Testing Live Analytics...")
        response = requests.get("http://localhost:8001/api/live-analytics", timeout=5)
        if response.status_code == 200:
            data = response.json()
            metrics = data['data']['live_metrics']
            print(f"SUCCESS: Live Analytics working")
            print(f"   Total Analyses: {metrics['total_analyses']}")
            print(f"   High Risk Patients: {metrics['high_risk_patients']}")
            print(f"   Avg Risk Score: {metrics['avg_risk_score']}")
        else:
            print(f"ERROR: Live Analytics error: {response.status_code}")
    except Exception as e:
        print(f"ERROR: Live Analytics not accessible: {e}")
    
    print()
    print("API testing complete!")
    print("=" * 50)

if __name__ == "__main__":
    # Wait a moment for APIs to start
    print("Waiting for APIs to start...")
    time.sleep(3)
    test_apis()
