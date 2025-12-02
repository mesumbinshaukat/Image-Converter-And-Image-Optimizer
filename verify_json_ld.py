import json
import re
import os

def check_file(filepath):
    print(f"Checking {filepath}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all JSON-LD blocks
        matches = re.findall(r'<script type="application/ld\+json">(.*?)</script>', content, re.DOTALL)
        
        if not matches:
            print(f"No JSON-LD blocks found in {filepath}")
            return False
            
        all_valid = True
        for i, match in enumerate(matches):
            try:
                json.loads(match)
                print(f"  Block {i+1}: Valid JSON")
            except json.JSONDecodeError as e:
                print(f"  Block {i+1}: Invalid JSON - {e}")
                all_valid = False
                
        return all_valid
    except Exception as e:
        print(f"Error reading file: {e}")
        return False

files_to_check = [
    r'e:\Projects\Image-Converter-And-Image-Optimizer\index.html',
    r'e:\Projects\Image-Converter-And-Image-Optimizer\frontend\index.html'
]

success = True
for f in files_to_check:
    if os.path.exists(f):
        if not check_file(f):
            success = False
    else:
        print(f"File not found: {f}")
        success = False

if success:
    print("\nSUCCESS: All JSON-LD blocks are valid.")
else:
    print("\nFAILURE: Some JSON-LD blocks are invalid.")
