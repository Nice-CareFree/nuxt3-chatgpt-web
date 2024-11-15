const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron')
const path = require('path')
const serve = require('electron-serve')

const loadURL = serve({ directory: 'dist' })
let tray = null
let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    icon: path.join(__dirname, '../public/icons/icon.png'),
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    }
  })

  mainWindow.setMenu(null)

  // 修复空白窗口问题
  if (process.env.NODE_ENV === 'development') {
    console.log('Loading development URL...')
    const devServerUrl = 'http://127.0.0.1:3000'
    mainWindow.loadURL(devServerUrl).catch((err) => {
      console.error('Failed to load dev URL:', err)
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    })
    mainWindow.webContents.openDevTools()
  } else {
    console.log('Loading production file...')
    try {
      const indexPath = path.join(__dirname, '../dist/index.html')
      console.log('Loading file:', indexPath)
      mainWindow.loadFile(indexPath).catch(console.error)
    } catch (err) {
      console.error('Failed to load production file:', err)
    }
  }

  // 添加窗口控制
  ipcMain.handle('window-minimize', () => mainWindow.minimize())
  ipcMain.handle('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })
  ipcMain.handle('window-close', () => {
    mainWindow.hide() // 隐藏而是关闭
  })

  // 窗口关闭时只隐藏
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      mainWindow.hide()
    }
    return false
  })

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription)
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        mainWindow.reload()
      }, 1000)
    }
  })

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully')
  })

  // 添加窗口样式
  if (process.platform === 'darwin') {
    mainWindow.setWindowButtonVisibility(false)
  }

  // Windows 平台特定设置
  if (process.platform === 'win32') {
    mainWindow.setBackgroundColor('#00000000')
    // 强制刷新窗口样式
    mainWindow.setSize(mainWindow.getSize()[0], mainWindow.getSize()[1])
  }
}

function createTray() {
  tray = new Tray(path.join(__dirname, '../public/icons/icon.png'))
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        mainWindow.show()
      }
    },
    {
      label: '退出',
      click: () => {
        app.isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('ChatGPT Desktop')
  tray.setContextMenu(contextMenu)

  // 点击托盘图标显示主窗口
  tray.on('click', () => {
    mainWindow.show()
  })
}

app.whenReady().then(() => {
  createWindow()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    } else {
      mainWindow.show()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 添加退出前的清理
app.on('before-quit', () => {
  app.isQuitting = true
})