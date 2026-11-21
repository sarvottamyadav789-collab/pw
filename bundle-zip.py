import zipfile
import os

os.makedirs('public', exist_ok=True)
os.makedirs('dist', exist_ok=True)

# Build public/cloudflare-pages.zip containing all files in dist/ except the zip itself
# Strictly exclude _routes.json as Cloudflare Pages Direct Upload explicitly rejects it
with zipfile.ZipFile('public/cloudflare-pages.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk('dist'):
        for file in files:
            if file == 'cloudflare-pages.zip' or file == '_routes.json' or file.endswith('.ts') or file.endswith('.tsx'):
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, 'dist')
            z.write(full_path, rel_path)

print("Created public/cloudflare-pages.zip successfully!")
