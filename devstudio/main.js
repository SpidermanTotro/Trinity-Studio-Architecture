/**
 * Trinity Studio - Electron Development Shell
 * SKELETON IMPLEMENTATION - MVP Version
 * 
 * This is a minimal Electron app that loads the DevHub API frontend.
 * In development mode, it connects to the API and AI helper services
 * running locally.
 * 
 * Security Notes:
 * - Use contextIsolation and nodeIntegration: false in production
 * - Implement Content Security Policy
 * - Validate all IPC messages
 * - Use secure protocols (HTTPS) in production
 */

const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

/**
 * Create the main application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'Trinity Studio DevHub',
    webPreferences: {
      // Security settings
      nodeIntegration: false, // Disable Node.js integration in renderer
      contextIsolation: true,  // Enable context isolation
      preload: path.join(__dirname, 'preload.js') // TODO: Add preload script for secure IPC
    },
    backgroundColor: '#1e1e1e',
    show: false // Don't show until ready-to-show
  });

  // Load the DevHub API endpoint
  // In development, this connects to localhost:3000
  // In production, this should be a built frontend app
  const devhubUrl = process.env.DEVHUB_URL || 'http://localhost:3000';
  
  console.log('[Trinity Studio] Loading DevHub from:', devhubUrl);
  mainWindow.loadURL(devhubUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('[Trinity Studio] Window ready');
  });

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links (open in default browser)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      require('electron').shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
}

/**
 * App lifecycle events
 */

app.whenReady().then(() => {
  console.log('='.repeat(60));
  console.log('Trinity Studio DevHub - Electron Shell (SKELETON MVP)');
  console.log('='.repeat(60));
  console.log('Version:', app.getVersion());
  console.log('Electron:', process.versions.electron);
  console.log('Node:', process.versions.node);
  console.log('Chrome:', process.versions.chrome);
  console.log('');
  console.log('Environment:', process.env.NODE_ENV || 'production');
  console.log('DevHub URL:', process.env.DEVHUB_URL || 'http://localhost:3000');
  console.log('='.repeat(60));
  
  createWindow();

  // On macOS, re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app quit
app.on('will-quit', () => {
  console.log('[Trinity Studio] Application quitting');
});

// Security: Prevent navigation to external sites
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    if (!allowedOrigins.some(origin => navigationUrl.startsWith(origin))) {
      console.log('[Security] Blocked navigation to:', navigationUrl);
      event.preventDefault();
    }
  });
});
