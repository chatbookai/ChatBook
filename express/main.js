import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron';
import isDev from 'electron-is-dev'
import settings from 'electron-settings';

import { server, getPort } from './src/app.js';
import { initChatBookSetting, initChatBookDbExec } from './src/utils/db.js';

const PORT = getPort();

let mainWindow;
let ChatBookSetting;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  //Start Setting Page
  mainWindow.loadFile('src/settings/index.html');

  ipcMain.on('start-chatbook', async (event, data) => {
    ChatBookSetting = await settings.get('chatbook');
    console.log("ChatBookSetting main.js", ChatBookSetting)
    await initChatBookSetting(ChatBookSetting);
    await initChatBookDbExec();
    mainWindow.loadURL('http://localhost:' + PORT);
  });
  
  const template = [
    {
      label: 'About',
      submenu: [
        {
          label: 'Website',
          click: () => {
            openNewURL('https://chatbookai.net/');
          }
        },
        {
          label: 'Github',
          click: () => {
            openNewURL('https://github.com/chatbookai/ChatBook');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });
}

function openNewURL(url) {
  const newWindow = new BrowserWindow({ width: 800, height: 600 });
  newWindow.loadURL(url);
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

ipcMain.on('open-folder-dialog', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  if (!result.canceled && result.filePaths.length > 0) {
    event.reply('selected-folder', result.filePaths[0]);
  }
});

ipcMain.on('save-chatbook', async (event, data) => {
  await settings.set('chatbook', data);
  console.log("save-chatbook", data);
  //mainWindow.webContents.send('data-chatbook', data);
});

ipcMain.on('get-chatbook', async (event) => {
  const data = await settings.get('chatbook');
  console.log("get-chatbook", data);
  event.reply('data-chatbook', data);
});
