const { BrowserWindow, Menu, dialog } = require("electron")

const openFolder = async () => {
  const win = BrowserWindow.getFocusedWindow()

  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ["openDirectory"],
  })

  if (canceled) return

  win.webContents.send("changeRoot", filePaths[0])
}

const reload = () => {
  const win = BrowserWindow.getFocusedWindow()
  win.webContents.reload()
}

const toggleDevtools = () => {
  const win = BrowserWindow.getFocusedWindow()
  win.webContents.toggleDevTools()
}

const menu = Menu.buildFromTemplate([
  {
    label: "File",
    submenu: [
      { label: "Open Folder", accelerator: "ctrl+k", click: openFolder },
    ],
  },
  {
    label: "Help",
    submenu: [
      { label: "Reload", accelerator: "ctrl+r", click: reload },
      {
        label: "Toogle Devtools",
        accelerator: "ctrl+shift+i",
        click: toggleDevtools,
      },
    ],
  },
])

module.exports = {
  menu,
}
