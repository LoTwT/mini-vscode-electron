/**
 * main, preload => web
 */

const { ipcRenderer } = require('electron')

const IPC_MAIN_REQUEST_CHANNEL = "ipc_main_request_channel"
const IPC_PRELOAD_REQUEST_CHANNEL = "ipc_preload_request_channel"

const IPC_RESPONSE_CHANNEL = "ipc_response_channel"
const PRELOAD_RESPONSE_CHANNEL = "preload_response_channel"

// 存放所有交互处理方法的容器
const handlers = {}
const addHandler = (channel, fn) => handlers[channel] = fn

/**
 * preload => web
 * @param {*} channel 
 * @param  {...any} args 
 * @returns 
 */
const preloadResponseToWeb = (channel, ...args) => window.postMessage({
    channel: PRELOAD_RESPONSE_CHANNEL + channel,
    data: args,
})



window.addEventListener('message', async (ev) => {
    let { channel, data, id } = ev.data
    if (!channel) return

    if (channel.startsWith(IPC_MAIN_REQUEST_CHANNEL)) {
        channel = channel.replace(IPC_MAIN_REQUEST_CHANNEL, '')

        try {
            const res = await ipcRenderer.invoke(channel, ...data)
            window.postMessage({
                channel: IPC_PRELOAD_REQUEST_CHANNEL, ok: true, data: res, id
            })
        } catch (e) {
            window.postMessage({
                channel: IPC_PRELOAD_REQUEST_CHANNEL, ok: false, error: e, id
            })
        }
    } else if (channel.startsWith(IPC_RESPONSE_CHANNEL)) {
        channel = channel.replace(IPC_RESPONSE_CHANNEL, '')

        try {
            let res = await handlers[channel](...data)
            window.postMessage({
                channel: IPC_RESPONSE_CHANNEL, ok: true, data: res, id
            })
        } catch (e) {
            window.postMessage({
                channel: IPC_RESPONSE_CHANNEL, ok: false, error: e, id
            })
        }
    }
})

module.exports = {
    addHandler,
    preloadResponseToWeb,
}