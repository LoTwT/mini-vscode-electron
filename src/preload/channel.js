const { ipcRenderer } = require("electron")

window.addEventListener("message", async function (ev) {
  let { channel, data, id } = ev.data
  if (channel.startsWith("ipc.call-")) {
    channel = channel.replace("ipc.call-", "")

    try {
      const res = await ipcRenderer.invoke(channel, ...data)
      window.postMessage({
        channel: "ipc-result",
        ok: true,
        data: res,
        id,
      })
    } catch (e) {
      window.postMessage({
        channel: "ipc-result",
        ok: false,
        error: e,
        id,
      })
    }
  } else if (channel.startsWith("ipc.pre-")) {
    channel = channel.replace("ipc.pre-", "")

    try {
      let res = await handles[channel](...data)
      window.postMessage({
        channel: "ipc-result",
        ok: true,
        data: res,
        id,
      })
    } catch (e) {
      window.postMessage({
        channel: "ipc-result",
        ok: false,
        error: e,
        id,
      })
    }
  }
})

const handles = {}
function handle(channel, fn) {
  handles[channel] = fn
}

module.exports = {
  handle,
}

ipcRenderer.on("changeRoot", (_, root) => {
  window.postMessage({
    channel: "main.changeRoot",
    value: root,
  })
})
