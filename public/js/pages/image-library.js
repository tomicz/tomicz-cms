// Image Library Page JavaScript

// API Key for authentication (will be loaded from environment)
let API_KEY = null;

// Authentication check
function checkAuthentication() {
  const storedKey = localStorage.getItem("imageLibraryApiKey");

  if (!storedKey || storedKey !== API_KEY) {
    showAuthForm();
    return false;
  }

  return true;
}

// Show authentication form
function showAuthForm() {
  const body = document.body;
  body.innerHTML = `
    <div class="auth-container">
      <div class="auth-form">
        <h1>🔐 Image Library Access</h1>
        <p>Enter your password to access the image library:</p>
        <input type="password" id="apiKeyInput" placeholder="Enter password..." />
        <button onclick="authenticate()">Access Image Library</button>
        <p class="auth-error" id="authError" style="display: none; color: #ff6b6b;"></p>
      </div>
    </div>
  `;
}

// Authenticate user (global function)
window.authenticate = function () {
  const input = document.getElementById("apiKeyInput");
  const error = document.getElementById("authError");
  const key = input.value.trim();

  if (key === API_KEY) {
    localStorage.setItem("imageLibraryApiKey", key);
    location.reload();
  } else {
    error.textContent = "Invalid password. Please try again.";
    error.style.display = "block";
    input.value = "";
  }
};

// Copy image URL to clipboard
window.copyImageUrl = async function (filename, buttonEl) {
  try {
    const origin = window.location.origin;
    const url = `${origin}/api/images/${filename}`;

    await navigator.clipboard.writeText(url);

    const originalText = buttonEl.textContent;
    buttonEl.textContent = "✅ Copied";
    buttonEl.disabled = true;
    setTimeout(() => {
      buttonEl.textContent = originalText;
      buttonEl.disabled = false;
    }, 1200);
  } catch (err) {
    console.error("Failed to copy:", err);
    alert(
      "Couldn't copy the URL. Please copy it manually: \n" +
        `${window.location.origin}/api/images/${filename}`
    );
  }
};

// Delete image
window.deleteImage = function (filename) {
  if (confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
    deleteImageConfirm(filename);
  }
};

async function deleteImageConfirm(filename) {
  try {
    const response = await fetch(`/api/images/${filename}`, {
      method: "DELETE",
      headers: {
        "X-API-Key": API_KEY,
      },
    });

    const result = await response.json();

    if (result.success) {
      alert("Image deleted successfully!");
      loadImages();
    } else {
      alert(`Failed to delete image: ${result.error}`);
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert("Failed to delete image. Please try again.");
  }
}

// Upload image
window.uploadImage = function () {
  document.getElementById("imageFileInput").click();
};

// Handle image file selection
window.handleImageSelect = function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const statusDiv = document.getElementById("uploadStatus");
  statusDiv.innerHTML = `<p style="color: #4CAF50;">📁 Image selected: ${file.name}</p>`;

  // Store the file for later upload
  window.selectedImageFile = file;

  // Auto-fill the filename field
  document.getElementById("imageFilename").value = file.name;
};

// Save image
window.saveImage = async function () {
  const filename = document.getElementById("imageFilename").value;
  const description = document.getElementById("imageDescription").value;
  const tags = document.getElementById("imageTags").value;

  if (!filename) {
    alert("Please enter a filename!");
    return;
  }

  if (!window.selectedImageFile) {
    alert("Please select an image file!");
    return;
  }

  const statusDiv = document.getElementById("uploadStatus");
  statusDiv.innerHTML = '<p style="color: #ffa500;">📤 Uploading image...</p>';

  try {
    const formData = new FormData();
    formData.append("image", window.selectedImageFile);

    const response = await fetch(`/api/images/upload/${filename}`, {
      method: "PUT",
      headers: {
        "X-API-Key": API_KEY,
      },
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      statusDiv.innerHTML = `<p style="color: #4CAF50;">✅ Image uploaded successfully: ${data.filename}</p>`;
      
      // Clear form
      document.getElementById("imageFilename").value = "";
      document.getElementById("imageDescription").value = "";
      document.getElementById("imageTags").value = "";
      window.selectedImageFile = null;
      
      // Reload images
      loadImages();
    } else {
      statusDiv.innerHTML = `<p style="color: #ff6b6b;">❌ Image upload failed: ${data.error}</p>`;
    }
  } catch (error) {
    console.error("Upload error:", error);
    statusDiv.innerHTML = '<p style="color: #ff6b6b;">❌ Image upload failed. Please try again.</p>';
  }
};

// Clear form
window.clearForm = function () {
  if (confirm("Are you sure you want to clear the form? All unsaved changes will be lost.")) {
    document.getElementById("imageFilename").value = "";
    document.getElementById("imageDescription").value = "";
    document.getElementById("imageTags").value = "";
    window.selectedImageFile = null;
    
    const statusDiv = document.getElementById("uploadStatus");
    if (statusDiv) {
      statusDiv.innerHTML = "";
    }
    
    const fileInput = document.getElementById("imageFileInput");
    if (fileInput) {
      fileInput.value = "";
    }
  }
};

// Load all images
async function loadImages() {
  try {
    const response = await fetch("/api/images/list", {
      headers: {
        "X-API-Key": API_KEY,
      },
    });

    const data = await response.json();
    const imagesList = document.getElementById("imagesList");

    if (data.images && data.images.length > 0) {
      imagesList.innerHTML = data.images
        .map(
          (image) => `
          <div class="image-item">
            <img src="/api/images/${image.filename}" alt="${image.description || image.filename}" class="image-preview" />
            <div class="image-info">
              <h3>${image.filename}</h3>
              <p class="image-meta">
                <span class="size">${image.size}</span> • 
                <span class="date">${new Date(image.uploadDate).toLocaleDateString()}</span>
              </p>
              <div class="image-actions">
                <button onclick="copyImageUrl('${image.filename}', this)" class="copy-btn" title="Copy image URL">🔗 Copy URL</button>
                <button onclick="deleteImage('${image.filename}')" class="delete-btn">🗑️ Delete</button>
              </div>
            </div>
          </div>
        `
        )
        .join("");

      // Show statistics
      const totalImages = data.images.length;
      const totalSize = data.images.reduce((sum, img) => sum + (img.sizeBytes || 0), 0);
      const avgSize = totalSize / totalImages;

      document.getElementById("imagesStats").innerHTML = `
        <div class="stats-container">
          <div class="stat-item">
            <span class="stat-number">${totalImages}</span>
            <span class="stat-label">Total Images</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${formatFileSize(totalSize)}</span>
            <span class="stat-label">Total Size</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${formatFileSize(avgSize)}</span>
            <span class="stat-label">Average Size</span>
          </div>
        </div>
      `;
    } else {
      imagesList.innerHTML = "<p>No images found.</p>";
      document.getElementById("imagesStats").innerHTML = "";
    }
  } catch (error) {
    console.error("Error loading images:", error);
    document.getElementById("imagesList").innerHTML = "<p>Error loading images.</p>";
  }
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Page-specific functionality
document.addEventListener("DOMContentLoaded", function () {
  console.log("Image library page loaded");

  // Check authentication first
  if (!checkAuthentication()) {
    return;
  }

  // User is authenticated, show image library interface
  showImageLibrary();
});

// Show image library interface
function showImageLibrary() {
  const mainContent = document.getElementById("image-library-main");
  mainContent.innerHTML = `
    <div class="admin-container">
      <div class="image-library-section">
        <h1>🖼️ Image Library</h1>
        <p>Upload and manage your website images</p>
        <div class="upload-interface">
          <div class="form-group">
            <label for="imageFilename">Filename:</label>
            <input type="text" id="imageFilename" placeholder="Enter filename (e.g., my-image.jpg)" />
          </div>
          <div class="form-group">
            <label for="imageDescription">Description:</label>
            <textarea id="imageDescription" placeholder="Optional image description..."></textarea>
          </div>
          <div class="form-group">
            <label for="imageTags">Tags (comma-separated):</label>
            <input type="text" id="imageTags" placeholder="website, hero, blog" />
          </div>
          <div class="upload-actions">
            <button type="button" onclick="uploadImage()" class="upload-btn">📁 Select Image</button>
            <input type="file" id="imageFileInput" accept="image/*" style="display: none;" onchange="handleImageSelect(event)" />
            <button onclick="saveImage()" class="save-btn">💾 Upload Image</button>
            <button onclick="clearForm()" class="clear-btn">🧹 Clear Form</button>
          </div>
          <div id="uploadStatus" class="upload-status"></div>
        </div>
      </div>
      
      <div class="images-section">
        <h2>📚 All Images</h2>
        <div id="imagesList" class="images-grid">
          <p>Loading images...</p>
        </div>
        <div id="imagesStats" class="images-stats"></div>
      </div>
    </div>
  `;

  // Load images list
  loadImages();
}

// Load API key from environment (this will be replaced by the actual key)
async function loadApiKey() {
  try {
    // Try to get API key from environment or config
    const response = await fetch("/api/config");
    const config = await response.json();
    API_KEY = config.API_SECRET_KEY;
  } catch (error) {
    console.error("Failed to load API key:", error);
    // Fallback to a default or show error
    alert("Failed to load API configuration. Please check your setup.");
  }
}

// Initialize when page loads
loadApiKey();