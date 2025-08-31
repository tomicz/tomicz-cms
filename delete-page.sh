#!/bin/bash

# Check if page name is provided
if [ $# -eq 0 ]; then
    echo "Usage: ./delete-page.sh <page-name>"
    echo "Example: ./delete-page.sh about"
    echo ""
    echo "Available pages:"
    ls -1 public/pages/*.html 2>/dev/null | sed 's|public/pages/||' | sed 's|.html||' || echo "No pages found"
    exit 1
fi

PAGE_NAME=$1
PAGE_FILE="public/pages/${PAGE_NAME}.html"
CSS_FILE="public/css/pages/${PAGE_NAME}.css"
JS_FILE="public/js/pages/${PAGE_NAME}.js"

# Check if the page exists
if [ ! -f "$PAGE_FILE" ]; then
    echo "❌ Error: Page '$PAGE_NAME' not found!"
    echo "Available pages:"
    ls -1 public/pages/*.html 2>/dev/null | sed 's|public/pages/||' | sed 's|.html||' || echo "No pages found"
    exit 1
fi

# Show page info before deletion
echo "📄 Page to delete: $PAGE_FILE"
echo "📅 Created: $(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "$PAGE_FILE" 2>/dev/null || stat -c "%y" "$PAGE_FILE" 2>/dev/null || echo "Unknown")"
echo "📏 Size: $(du -h "$PAGE_FILE" | cut -f1)"

# Check if CSS file exists
if [ -f "$CSS_FILE" ]; then
    echo "🎨 CSS file: $CSS_FILE"
    echo "📏 CSS Size: $(du -h "$CSS_FILE" | cut -f1)"
fi

# Check if JavaScript file exists
if [ -f "$JS_FILE" ]; then
    echo "⚡ JavaScript file: $JS_FILE"
    echo "📏 JS Size: $(du -h "$JS_FILE" | cut -f1)"
fi

# Ask for confirmation
echo ""
read -p "Are you sure you want to delete this page? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm "$PAGE_FILE"
    echo "✅ Deleted: $PAGE_FILE"
    
    # Delete CSS file if it exists
    if [ -f "$CSS_FILE" ]; then
        rm "$CSS_FILE"
        echo "✅ Deleted: $CSS_FILE"
    fi
    
    # Delete JavaScript file if it exists
    if [ -f "$JS_FILE" ]; then
        rm "$JS_FILE"
        echo "✅ Deleted: $JS_FILE"
    fi
else
    echo "❌ Deletion cancelled"
    exit 0
fi
