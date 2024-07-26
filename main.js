const { app, BrowserWindow, ipcMain, screen } = require("electron/main");
const path = require("node:path");
const os = require("os");

let mainWindow;

function createWindow() {
  const displays = screen.getAllDisplays();
  const hostname = os.hostname();
  let windowScreen;

  if (hostname === "cns-016") {
    if (displays.length >= 2) {
      windowScreen = displays[1];
    } else {
      windowScreen = displays[0];
    }
  } else {
    windowScreen = displays[0];
  }

  mainWindow = new BrowserWindow({
    x: windowScreen.bounds.x,
    y: windowScreen.bounds.y,
    width: 1010,
    height: 540,
    // maxWidth: 1024,
    // maxHeight: 563,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "src/assets/icons/icon.png"),
  });

  mainWindow.setMinimumSize(1000, 520);

  mainWindow.loadFile("src/index.html");

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

// Ensure only one instance of the app is running
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on("second-instance", () => {
    // Focus the main window if a second instance is attempted to be opened
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  ipcMain.on("close-app", () => {
    setTimeout(() => {
      app.quit();
    }, 3000);
  });
}
