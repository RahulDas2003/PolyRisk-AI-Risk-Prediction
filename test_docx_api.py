#!/usr/bin/env python3
"""
Test DOCX API endpoints
"""

import requests
import time
import os

def test_docx_endpoints():
    """Test the DOCX generation endpoints"""
    print("Testing DOCX API endpoints...")
    print("=" * 50)
    
    # Wait for API to start
    time.sleep(3)
    
    # Test main API health
    try:
        response = requests.get("http://localhost:8000/api/health", timeout=5)
        if response.status_code == 200:
            print("SUCCESS: Main API is running")
        else:
            print(f"ERROR: Main API returned status: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Main API not accessible: {e}")
        return
    
    # Test DOCX generation with a real file
    test_filename = "ai_analysis_20251005_143002_Rahul_Das.json"
    
    try:
        # Test view DOCX endpoint
        print(f"\nTesting view DOCX endpoint with: {test_filename}")
        response = requests.get(f"http://localhost:8000/api/view-docx/{test_filename}", timeout=10)
        
        if response.status_code == 200:
            print("SUCCESS: View DOCX endpoint working")
            print(f"   Content-Type: {response.headers.get('content-type', 'Unknown')}")
            print(f"   Content-Length: {len(response.content)} bytes")
        else:
            print(f"ERROR: View DOCX failed with status: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"ERROR: View DOCX request failed: {e}")
    
    try:
        # Test download DOCX endpoint
        print(f"\nTesting download DOCX endpoint with: {test_filename}")
        response = requests.get(f"http://localhost:8000/api/generate-docx/{test_filename}", timeout=10)
        
        if response.status_code == 200:
            print("SUCCESS: Download DOCX endpoint working")
            print(f"   Content-Type: {response.headers.get('content-type', 'Unknown')}")
            print(f"   Content-Length: {len(response.content)} bytes")
            
            # Save a test file
            with open("test_downloaded_report.docx", "wb") as f:
                f.write(response.content)
            print("   SUCCESS: Test DOCX file saved as 'test_downloaded_report.docx'")
        else:
            print(f"ERROR: Download DOCX failed with status: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Download DOCX request failed: {e}")
    
    print("\n" + "=" * 50)
    print("DOCX API testing complete!")

if __name__ == "__main__":
    test_docx_endpoints()
