const path = require("path")
const { app, BrowserWindow } = require("electron")
const { menu } = require("./menu.js")
const { initExtensions } = require("./extension")
const { getGlobals } = require("./globals.js")

const preload = path.resolve(__dirname, "../preload/preload")

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    backgroundColor: "#1e1e1e",
    webPreferences: {
      preload,
      spellcheck: false,
    },
  })

  mainWindow.webContents.send("globalChanged", getGlobals())

  mainWindow.setMenu(menu)
  mainWindow.loadURL("http://localhost:3000")
}

app.on("ready", () => {
  createWindow()
  initExtensions()
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
