#!/bin/bash

# Check if page name is provided
if [ $# -eq 0 ]; then
    echo "Usage: ./make-page.sh <page-name>"
    echo "Example: ./make-page.sh about"
    exit 1
fi

# Get the page name from argument
PAGE_NAME=$1
PAGE_NAME_CAPITALIZED=$(echo $PAGE_NAME | awk '{print toupper(substr($0,1,1)) substr($0,2)}')

# Create the pages directory if it doesn't exist
mkdir -p public/pages

# Create the CSS directory if it doesn't exist
mkdir -p public/css/pages

# Create the JS pages directory if it doesn't exist
mkdir -p public/js/pages

# Create the HTML file
cat > "public/pages/${PAGE_NAME}.html" << EOF
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <!-- Google tag (gtag.js) -->
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-RJW428Z054"
    ></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());

      gtag("config", "G-RJW428Z054");
    </script>

    <!-- Primary Meta Tags -->
    <meta
      name="description"
      content="${PAGE_NAME_CAPITALIZED} - Unity game development and C# programming with professional developer Darko Tomic."
    />
    <meta
      name="keywords"
      content="Darko Tomic, Unity tutorials, game development, C# programming, ${PAGE_NAME}"
    />
    <meta name="author" content="Darko Tomic" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#4CAF50" />

    <!-- Favicon -->
    <link rel="icon" href="../images/favicon.ico" type="image/x-icon" />

    <!-- Title -->
    <title>${PAGE_NAME_CAPITALIZED} - Darko Tomic</title>

    <!-- Resource Hints -->
    <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
    <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
      rel="stylesheet"
      media="print"
      onload="this.media='all'"
    />

    <!-- CSS -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
      integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
      media="print"
      onload="this.media='all'"
    />
    <link rel="stylesheet" href="../css/common.css" />
    <link rel="stylesheet" href="../css/components.css" />
    <link rel="stylesheet" href="../css/pages/${PAGE_NAME}.css" />
  </head>
  <body>
    <page-header></page-header>
    <script
      type="module"
      src="../js/components/page-components/page-header.js"
    ></script>

    <!-- ${PAGE_NAME_CAPITALIZED} content will go here -->

    <page-links></page-links>
    <script
      type="module"
      src="../js/components/page-components/page-links.js"
    ></script>

    <page-footer></page-footer>
    <script
      type="module"
      src="../js/components/page-components/page-footer.js"
    ></script>

    <script type="module" src="../js/core/main.js"></script>
    <script type="module" src="../js/pages/${PAGE_NAME}.js"></script>
  </body>
</html>
EOF

echo "✅ Created public/pages/${PAGE_NAME}.html"
echo "📝 Edit the file to add your content!"

# Create the CSS file
cat > "public/css/pages/${PAGE_NAME}.css" << EOF
/* ${PAGE_NAME_CAPITALIZED} Page Styles */

/* Page-specific styles for ${PAGE_NAME} */
.${PAGE_NAME}-page {
    /* Add your page-specific styles here */
}

/* Responsive design */
@media (max-width: 768px) {
    .${PAGE_NAME}-page {
        /* Mobile styles */
    }
}
EOF

echo "✅ Created public/css/pages/${PAGE_NAME}.css"
echo "📝 Edit the CSS file to add your page-specific styles!"

# Create the JavaScript file
cat > "public/js/pages/${PAGE_NAME}.js" << EOF
// ${PAGE_NAME_CAPITALIZED} Page JavaScript

// Page-specific functionality for ${PAGE_NAME}
document.addEventListener('DOMContentLoaded', function() {
    // Add your page-specific JavaScript here
    console.log('${PAGE_NAME_CAPITALIZED} page loaded');
});
EOF

echo "✅ Created public/js/pages/${PAGE_NAME}.js"
echo "📝 Edit the JavaScript file to add your page-specific functionality!"
