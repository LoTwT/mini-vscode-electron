const { BrowserWindow } = require("electron")

const _globals = {}

function getGlobals() {
  return _globals
}

function set(key, value) {
  _globals[key] = value

  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send("globalChanged", _globals)
  })
}

module.exports = {
  getGlobals,
  set,
}
