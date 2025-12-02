with open(r'e:\Projects\Image-Converter-And-Image-Optimizer\index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i in range(162, 166):
        print(f"{i+1}: {repr(lines[i])}")
