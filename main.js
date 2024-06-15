const { app, BrowserWindow, ipcMain, screen } = require("electron/main");
const path = require("node:path");

let mainWindow;

function createWindow() {
  const displays = screen.getAllDisplays();
  let windowScreen;

  if (displays.length >= 2) {
    windowScreen = displays[1];
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

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
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
