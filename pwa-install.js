// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              if (confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// PWA Install prompt
let deferredPrompt;
const installButton = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent default install prompt
  e.preventDefault();
  // Store the event for later use
  deferredPrompt = e;
  
  // Show custom install button
  if (installButton) {
    installButton.style.display = 'block';
  }
  
  // Or show a custom install banner
  showInstallBanner();
});

function showInstallBanner() {
  // Create a custom install banner
  const banner = document.createElement('div');
  banner.id = 'install-banner';
  banner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      color: white;
      padding: 16px;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      animation: slideUp 0.3s ease-out;
    ">
      <div style="flex: 1;">
        <strong style="display: block; margin-bottom: 4px;">Install EmberMate</strong>
        <span style="font-size: 14px;">Get quick access to your health tracking</span>
      </div>
      <button id="install-app-button" style="
        background: white;
        color: #f97316;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        margin-right: 8px;
      ">Install</button>
      <button id="dismiss-install" style="
        background: transparent;
        color: white;
        border: 1px solid white;
        padding: 10px 16px;
        border-radius: 6px;
        cursor: pointer;
      ">Not now</button>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
  
  // Install button handler
  document.getElementById('install-app-button').addEventListener('click', installApp);
  
  // Dismiss button handler
  document.getElementById('dismiss-install').addEventListener('click', () => {
    banner.remove();
    localStorage.setItem('installPromptDismissed', Date.now());
  });
}

async function installApp() {
  if (!deferredPrompt) {
    return;
  }
  
  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for the user's response
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to install prompt: ${outcome}`);
  
  // Clear the prompt
  deferredPrompt = null;
  
  // Hide install banner
  const banner = document.getElementById('install-banner');
  if (banner) {
    banner.remove();
  }
}

// Detect when app is installed
window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully');
  deferredPrompt = null;
  
  // Hide install banner
  const banner = document.getElementById('install-banner');
  if (banner) {
    banner.remove();
  }
});

// Check if app is running in standalone mode
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone ||
         document.referrer.includes('android-app://');
}

if (isStandalone()) {
  console.log('App is running in standalone mode');
}

// Add to existing button in your HTML
if (installButton) {
  installButton.addEventListener('click', installApp);
}
