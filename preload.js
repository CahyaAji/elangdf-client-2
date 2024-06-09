const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const utm = require("utm");

contextBridge.exposeInMainWorld("NodeFn", {
  writeFile: (path, data, options) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, options, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },
  readFile: (path, options) => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, options, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },
  convertUtm: (lat, lon) => {
    return utm.fromLatLon(lat, lon);
  },

  closeApp: () => {
    ipcRenderer.send("close-app");
  },
});
