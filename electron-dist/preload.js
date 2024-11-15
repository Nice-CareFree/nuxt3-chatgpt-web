"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { contextBridge, ipcRenderer } = require('electron');
// 创建 API
const api = {
    minimize: () => ipcRenderer.send('minimize'),
    maximize: () => ipcRenderer.send('maximize'),
    close: () => ipcRenderer.send('close'),
    isMaximized: () => ipcRenderer.invoke('isMaximized'),
};
// 暴露 API
contextBridge.exposeInMainWorld('electron', api);
