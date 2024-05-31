import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev'
import { server, getPort } from './src/app.js';

const PORT = getPort();


let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL('http://localhost:' + PORT);
  
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });
}

app.whenReady().then(()=>{
  createMainWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    server.close();
    app.quit();
  }
});
