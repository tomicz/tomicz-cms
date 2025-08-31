#!/bin/bash

PAGES_DIR="public/pages"

# Check if pages directory exists
if [ ! -d "$PAGES_DIR" ]; then
    echo "❌ Pages directory not found: $PAGES_DIR"
    exit 1
fi

# Count total pages
TOTAL_PAGES=$(ls -1 "$PAGES_DIR"/*.html 2>/dev/null | wc -l | tr -d ' ')

if [ "$TOTAL_PAGES" -eq 0 ]; then
    echo "📁 No pages found in $PAGES_DIR"
    exit 0
fi

echo "📄 Found $TOTAL_PAGES page(s) in $PAGES_DIR:"
echo ""

# List pages with details
for file in "$PAGES_DIR"/*.html; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        pagename=$(basename "$file" .html)
        
        # Get file stats (works on both macOS and Linux)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            created_date=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "$file" 2>/dev/null)
            modified_date=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "$file" 2>/dev/null)
        else
            # Linux
            created_date=$(stat -c "%y" "$file" 2>/dev/null | cut -d' ' -f1,2 | sed 's/\./ /' | cut -d' ' -f1,2)
            modified_date=$(stat -c "%y" "$file" 2>/dev/null | cut -d' ' -f1,2 | sed 's/\./ /' | cut -d' ' -f1,2)
        fi
        
        size=$(du -h "$file" | cut -f1)
        
        echo "📄 $pagename"
        echo "   📁 File: $filename"
        echo "   📏 Size: $size"
        echo "   📅 Modified: $modified_date"
        echo "   🔗 URL: /pages/$filename"
        
        # Check if CSS file exists
        css_file="public/css/pages/${pagename}.css"
        if [ -f "$css_file" ]; then
            css_size=$(du -h "$css_file" | cut -f1)
            echo "   🎨 CSS: ${pagename}.css ($css_size)"
        fi
        echo ""
    fi
done

echo "💡 Tip: Use './scripts/make-page.sh <name>' to create a new page"
echo "💡 Tip: Use './scripts/delete-page.sh <name>' to delete a page"
