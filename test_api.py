import requests
import json
import os

# Test configuration
BASE_URL = "http://localhost:8000/api"
TEST_IMAGES_DIR = "Testing-Images"

print("=" * 80)
print("IMGIFY - COMPREHENSIVE API TESTING")
print("=" * 80)

# Test 1: Image Optimization
print("\n[TEST 1] Image Optimization - Single Image")
print("-" * 80)
try:
    with open(os.path.join(TEST_IMAGES_DIR, "Jersey1.jpg"), "rb") as f:
        files = {"images[]": f}
        data = {"quality": 85}
        response = requests.post(f"{BASE_URL}/optimize", files=files, data=data)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print("[OK] SUCCESS")
        print(f"Results: {json.dumps(result, indent=2)}")
    else:
        print(f"[FAIL] FAILED: {response.text}")
except Exception as e:
    print(f"[FAIL] ERROR: {str(e)}")

# Test 2: Image Optimization - Multiple Images
print("\n[TEST 2] Image Optimization - Multiple Images (Batch)")
print("-" * 80)
try:
    files = [
        ("images[]", open(os.path.join(TEST_IMAGES_DIR, "Jersey1.jpg"), "rb")),
        ("images[]", open(os.path.join(TEST_IMAGES_DIR, "arrow.png"), "rb")),
        ("images[]", open(os.path.join(TEST_IMAGES_DIR, "Screenshot 2025-07-03 023305.jpg"), "rb"))
    ]
    data = {"quality": 85}
    response = requests.post(f"{BASE_URL}/optimize", files=files, data=data)
    
    # Close files
    for _, f in files:
        f.close()
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print("[OK] SUCCESS")
        print(f"Processed {len(result['results'])} images")
        for r in result['results']:
            if 'error' not in r:
                print(f"  - {r['filename']}: {r['original_size']} -> {r['optimized_size']} bytes ({r['compression_ratio']}% saved)")
    else:
        print(f"[FAIL] FAILED: {response.text}")
except Exception as e:
    print(f"[FAIL] ERROR: {str(e)}")

# Test 3: Image Conversion
print("\n[TEST 3] Image Conversion - JPG to PNG")
print("-" * 80)
try:
    with open(os.path.join(TEST_IMAGES_DIR, "Jersey1.jpg"), "rb") as f:
        files = {"images[]": f}
        data = {"format": "png", "quality": 90}
        response = requests.post(f"{BASE_URL}/convert", files=files, data=data)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print("[OK] SUCCESS")
        print(f"Results: {json.dumps(result, indent=2)}")
    else:
        print(f"[FAIL] FAILED: {response.text}")
except Exception as e:
    print(f"[FAIL] ERROR: {str(e)}")

# Test 4: Rate Limiting - Exceed Batch Limit (Guest)
print("\n[TEST 4] Rate Limiting - Exceed Batch Limit (6 images, limit is 5)")
print("-" * 80)
try:
    files = [
        ("images[]", open(os.path.join(TEST_IMAGES_DIR, "Jersey1.jpg"), "rb")),
        ("images[]", open(os.path.join(TEST_IMAGES_DIR, "arrow.png"), "rb")),
        ("images[]", open(os.path.join(TEST_IMAGES_DIR, "Screenshot 2025-07-03 023305.jpg"), "rb")),
        ("images[]", open(os.path.join(TEST_IMAGES_DIR, "Screenshot 2025-11-13 001808.jpg"), "rb")),
        ("images[]", open(os.path.join(TEST_IMAGES_DIR, "jersey2.jpg"), "rb")),
        ("images[]", open(os.path.join(TEST_IMAGES_DIR, "Vin_jin.jpg"), "rb"))
    ]
    data = {"quality": 85}
    response = requests.post(f"{BASE_URL}/optimize", files=files, data=data)
    
    # Close files
    for _, f in files:
        f.close()
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 429:
        print("[OK] SUCCESS - Rate limit enforced correctly")
        print(f"Response: {response.json()}")
    else:
        print(f"[FAIL] UNEXPECTED: Expected 429, got {response.status_code}")
        print(f"Response: {response.text}")
except Exception as e:
    print(f"[FAIL] ERROR: {str(e)}")

# Test 5: Invalid File Type
print("\n[TEST 5] Error Handling - Invalid File Type")
print("-" * 80)
try:
    with open(os.path.join(TEST_IMAGES_DIR, "HarukazeSolid.ttf"), "rb") as f:
        files = {"images[]": f}
        data = {"quality": 85}
        response = requests.post(f"{BASE_URL}/optimize", files=files, data=data)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 422:
        print("[OK] SUCCESS - Validation error as expected")
        print(f"Response: {response.json()}")
    else:
        print(f"Response: {response.text}")
except Exception as e:
    print(f"[FAIL] ERROR: {str(e)}")

# Test 6: Admin Authentication
print("\n[TEST 6] Admin Authentication")
print("-" * 80)
try:
    data = {"email": "mesum@worldoftech.company", "password": "admin123"}
    response = requests.post(f"{BASE_URL}/login", json=data)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print("[OK] SUCCESS - Admin login successful")
        print(f"User: {result['user']['username']} ({result['user']['role']})")
        print(f"Token: {result['token'][:50]}...")
        global admin_token
        admin_token = result['token']
    else:
        print(f"[FAIL] FAILED: {response.text}")
except Exception as e:
    print(f"[FAIL] ERROR: {str(e)}")

# Test 7: Contact Form
print("\n[TEST 7] Contact Form Submission")
print("-" * 80)
try:
    data = {"name": "Test User", "email": "test@example.com", "subject": "Test Message", "message": "This is a test message from automated testing.", "honeypot": ""}
    response = requests.post(f"{BASE_URL}/contact", json=data)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("[OK] SUCCESS - Contact form submitted")
        print(f"Response: {response.json()}")
    else:
        print(f"[FAIL] FAILED: {response.text}")
except Exception as e:
    print(f"[FAIL] ERROR: {str(e)}")

# Test 8: Contact Form - Bot Protection (Honeypot)
print("\n[TEST 8] Contact Form - Bot Protection (Honeypot filled)")
print("-" * 80)
try:
    data = {"name": "Bot User", "email": "bot@example.com", "subject": "Spam", "message": "This is spam", "honeypot": "I am a bot"}
    response = requests.post(f"{BASE_URL}/contact", json=data)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("[OK] SUCCESS - Bot submission silently accepted (honeypot working)")
        print(f"Response: {response.json()}")
    else:
        print(f"Response: {response.text}")
except Exception as e:
    print(f"[FAIL] ERROR: {str(e)}")

print("\n" + "=" * 80)
print("TESTING COMPLETE")
print("=" * 80)
