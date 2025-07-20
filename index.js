const path = require('path');
const fs = require('fs');
const { app, BrowserWindow, ipcMain } = require('electron');
const { platform } = require('os');

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'AI Chatbox',
        width: 800,
        height: 600,
        webPreferences: {
        }
    });

    mainWindow.loadFile(path.join(__dirname,'/index.html'));
    mainWindow.setMenu(null);
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createMainWindow();    
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    }
});