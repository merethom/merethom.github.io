#!/usr/bin/env python3
"""
Auto-update SITE-DOCUMENTATION.md with current site structure
Updates: File Structure, Component List, and Timestamp
"""
import os
import re
from pathlib import Path
from datetime import datetime


def generate_file_structure():
    """Generate current file structure tree"""
    root = Path('.')
    lines = []
    
    # Define structure to display
    items = [
        ('index.html', 'Homepage', False),
        ('404.html', 'Custom error page', False),
        ('deadlines.html', 'Deadline policy page', False),
        ('courses/', 'Individual course pages', True),
        ('css/', 'All site styles', True),
        ('scripts/', 'All Web Components + utilities', True),
        ('img/', 'Images and icons', True),
        ('.nojekyll', 'Disables Jekyll on GitHub Pages', False),
    ]
    
    for path, description, is_dir in items:
        full_path = Path(path)
        if not full_path.exists():
            continue
            
        if is_dir and full_path.is_dir():
            lines.append(f"├── {path:<25} # {description}")
            
            # List contents of specific directories
            if path == 'courses/':
                for item in sorted(full_path.glob('*.html')):
                    lines.append(f"│   ├── {item.name}")
            elif path == 'css/':
                lines.append(f"│   └── design.css              # All site styles")
            elif path == 'scripts/':
                lines.append(f"│   ├── components.js           # All Web Components + utilities")
                lines.append(f"│   └── data/")
                data_path = full_path / 'data'
                if data_path.exists():
                    for item in sorted(data_path.iterdir()):
                        if item.name.startswith('.'):
                            continue
                        prefix = "│       ├──" if item.suffix == '.json' else "│       └──"
                        comment = ""
                        if item.name == 'courses.json':
                            comment = " # Course metadata"
                        elif item.suffix == '.json':
                            comment = " # Course weekly content"
                        elif item.suffix == '.md':
                            comment = " # JSON schema docs"
                        lines.append(f"{prefix} {item.name:<25}{comment}")
            elif path == 'img/':
                for item in sorted(full_path.iterdir()):
                    if item.name.startswith('.'):
                        continue
                    lines.append(f"│   ├── {item.name}")
        else:
            lines.append(f"├── {path:<25} # {description}")
    
    return "```\nteaching-site/\n" + "\n".join(lines) + "\n```"


def extract_components(js_file_path):
    """Extract Web Component definitions from components.js"""
    with open(js_file_path, 'r') as f:
        content = f.read()
    
    # Find customElements.define calls
    pattern = r"customElements\.define\(['\"]([^'\"]+)['\"],\s*(\w+)\)"
    matches = re.findall(pattern, content)
    
    components = []
    for tag_name, class_name in matches:
        # Find the class definition to get approximate line number
        class_pattern = rf'class\s+{class_name}\s+extends\s+HTMLElement'
        class_match = re.search(class_pattern, content)
        
        if class_match:
            # Count lines up to this point
            lines_before = content[:class_match.start()].count('\n')
            components.append((tag_name, class_name, lines_before + 1))
    
    return components


def update_documentation():
    """Update SITE-DOCUMENTATION.md with current information"""
    doc_file = Path('SITE-DOCUMENTATION.md')
    
    if not doc_file.exists():
        print("❌ SITE-DOCUMENTATION.md not found")
        return False
    
    with open(doc_file, 'r') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Update File Structure
    new_structure = generate_file_structure()
    # Find the file structure section (between ### File Structure and ---)
    structure_pattern = r'(### File Structure\s*\n\s*\n)```\nteaching-site/\n.*?\n```'
    content = re.sub(
        structure_pattern,
        r'\1' + new_structure,
        content,
        flags=re.DOTALL
    )
    
    # 2. Update Component List
    components = extract_components('scripts/components.js')
    if components:
        component_section = "\n### Available Components\n\n"
        for i, (tag, cls, line_num) in enumerate(components, 1):
            component_section += f"#### {i}. `<{tag}>`\n"
            component_section += f"**Location**: Lines ~{line_num} in components.js\n"
            
            # Add purpose based on tag name
            if tag == 'site-header':
                component_section += "**Purpose**: Displays course heading, description, and project briefs link\n"
                component_section += "**Usage**: \n```html\n"
                component_section += "<site-header></site-header>                    <!-- For index.html -->\n"
                component_section += "<site-header course-id=\"specialTopics\"></site-header>  <!-- For course pages -->\n```\n"
                component_section += "**Data Source**: `scripts/data/courses.json`\n"
                component_section += "**Key Fields**: `courseHeading`, `courseDescription`, `projectBriefsUrl`\n\n"
            elif tag == 'site-footer':
                component_section += "**Purpose**: Static footer with contact info, flags, and pixel stars\n"
                component_section += "**Usage**: `<site-footer></site-footer>`\n"
                component_section += "**Accessibility**: Uses `role=\"contentinfo\"` and `aria-hidden=\"true\"` for decorative elements\n\n"
            elif tag == 'course-info':
                component_section += "**Purpose**: Displays course metadata (code, name, term, year)\n"
                component_section += "**Usage**: `<course-info course-id=\"specialTopics\"></course-info>`\n"
                component_section += "**Data Source**: `scripts/data/courses.json`\n"
                component_section += "**Features**: \n- Program mapping (ixd → \"Interaction Design\")\n- Dynamic year display\n\n"
            elif tag == 'site-nav':
                component_section += "**Purpose**: Main navigation with expandable sections\n"
                component_section += "**Usage**: `<site-nav></site-nav>`\n"
                component_section += "**Features**:\n"
                component_section += "- Dynamically populated course links from `courses.json`\n"
                component_section += "- Persistent state using localStorage (nav sections remember open/closed state)\n"
                component_section += "- Expandable \"Classes\" and \"About\" sections using `<details>`\n"
                component_section += "**localStorage Keys**: `nav-classes`, `nav-about`\n\n"
            elif tag == 'course-weekly-content':
                component_section += "**Purpose**: Displays weekly lecture content with Figma embeds and links\n"
                component_section += "**Usage**: `<course-weekly-content course-id=\"specialTopics\"></course-weekly-content>`\n"
                component_section += "**Data Source**: `scripts/data/{course-id}.json` (converted to kebab-case)\n"
                component_section += "**Features**:\n"
                component_section += "- Reverse chronological order (newest week first)\n"
                component_section += "- Most recent week expanded by default\n"
                component_section += "- Figma URL conversion (share URL → embed URL)\n"
                component_section += "- Path-aware (works in subdirectories)\n\n"
            elif tag == 'current-year':
                component_section += "**Purpose**: Displays current year dynamically\n"
                component_section += "**Usage**: `<current-year></current-year>`\n\n"
            else:
                component_section += f"**Usage**: `<{tag}></{tag}>`\n\n"
        
        # Replace the component section
        component_pattern = r'(### Available Components\s*\n\s*\n)(.*?)(\n---)'
        content = re.sub(
            component_pattern,
            r'\1' + component_section.strip() + r'\3',
            content,
            flags=re.DOTALL
        )
    
    # 3. Update Timestamp
    today = datetime.now().strftime("%B %Y")
    content = re.sub(
        r'\*\*Last Updated\*\*:.*',
        f'**Last Updated**: {today}',
        content
    )
    
    # Write updated content
    if content != original_content:
        with open(doc_file, 'w') as f:
            f.write(content)
        
        print(f"✅ Documentation updated: {today}")
        print(f"   - File structure refreshed")
        print(f"   - {len(components)} Web Components listed")
        print(f"   - Timestamp updated")
        return True
    else:
        print("ℹ️  No changes needed")
        return False


if __name__ == '__main__':
    try:
        changed = update_documentation()
        exit(0 if changed else 0)  # Exit 0 regardless, let git detect changes
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
