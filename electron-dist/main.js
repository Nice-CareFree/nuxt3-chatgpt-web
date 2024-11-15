"use strict";
const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const serve = require('electron-serve');
console.log('Starting Electron app...');
const loadURL = serve({ directory: 'dist' });
let mainWindow = null;
let tray = null;
const SERVER_URL = process.env.SERVER_ENV || 'http://localhost:3000';
// 创建扩展的 app 实例
const electronApp = app;
function createWindow() {
    console.log('Creating window...');
    try {
        const iconPath = path.join(__dirname, process.env.NODE_ENV === 'development' ? '../public' : '../dist', 'icon.png');
        mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            frame: false,
            icon: iconPath,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js')
            },
            show: false
        });
        console.log('Loading URL...');
        if (process.env.NODE_ENV === 'development') {
            console.log('Development mode, loading:', 'http://localhost:3000');
            mainWindow.loadURL('http://localhost:3000');
            mainWindow.webContents.openDevTools();
        }
        else if (process.env.USE_SERVER === 'true') {
            console.log('Server mode, loading:', SERVER_URL);
            mainWindow.loadURL(SERVER_URL);
        }
        else {
            console.log('Production mode, loading local files');
            loadURL(mainWindow);
        }
        mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            console.error('Failed to load:', errorCode, errorDescription);
        });
        mainWindow.on('ready-to-show', () => {
            console.log('Window ready to show');
            mainWindow?.show();
        });
        ipcMain.on('minimize', () => {
            mainWindow?.minimize();
        });
        ipcMain.on('maximize', () => {
            if (mainWindow?.isMaximized()) {
                mainWindow.restore();
            }
            else {
                mainWindow?.maximize();
            }
        });
        ipcMain.on('close', () => {
            mainWindow?.close();
        });
        ipcMain.handle('isMaximized', () => {
            return mainWindow?.isMaximized();
        });
    }
    catch (error) {
        console.error('Error creating window:', error);
    }
}
function createTray() {
    const iconPath = path.join(__dirname, process.env.NODE_ENV === 'development' ? '../public' : '../dist', 'icon.png');
    tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '显示主窗口',
            click: () => {
                mainWindow?.show();
            }
        },
        {
            label: '隐藏主窗口',
            click: () => {
                mainWindow?.hide();
            }
        },
        { type: 'separator' },
        {
            label: '退出',
            click: () => {
                electronApp.isQuitting = true;
                electronApp.quit();
            }
        }
    ]);
    tray.setToolTip('奈斯AI-Web');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
        if (mainWindow?.isVisible()) {
            mainWindow.hide();
        }
        else {
            mainWindow?.show();
        }
    });
}
// 初始化 isQuitting 标志
electronApp.isQuitting = false;
app.whenReady().then(() => {
    console.log('App ready, creating window and tray...');
    createWindow();
    createTray();
    app.on('activate', () => {
        console.log('App activated');
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
}).catch((error) => {
    console.error('Error in app ready:', error);
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('before-quit', () => {
    electronApp.isQuitting = true;
});
// 添加未捕获异常处理
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
});
process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
});
