import re
import base64
import os

def fix_svg_encoding(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find data:image/svg+xml;utf8,<svg ... </svg>
    # Note: The HTML uses single quotes for src
    pattern = r"src='data:image/svg\+xml;utf8,(<svg.*?</svg>)'"
    
    def replace_match(match):
        svg_content = match.group(1)
        # Encode SVG content to base64
        encoded = base64.b64encode(svg_content.encode('utf-8')).decode('utf-8')
        return f"src='data:image/svg+xml;base64,{encoded}'"

    new_content = re.sub(pattern, replace_match, content, flags=re.DOTALL)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {file_path}")
    else:
        print(f"No changes in {file_path}")

slides_dir = 'workspace/slides'
for filename in ['slide1.html', 'slide2.html', 'slide3.html', 'slide4.html']:
    fix_svg_encoding(os.path.join(slides_dir, filename))
