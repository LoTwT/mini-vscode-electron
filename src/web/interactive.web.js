/**
 * web => main, preload
 */

// 存放所有监听事件的容器
const listeners = {}
// 存放等待完成事务的容器
const todoTransactions = {}

const IPC_MAIN_REQUEST_CHANNEL = "ipc_main_request_channel"
const IPC_PRELOAD_REQUEST_CHANNEL = "ipc_preload_request_channel"

const IPC_RESPONSE_CHANNEL = "ipc_response_channel"
const PRELOAD_RESPONSE_CHANNEL = "preload_response_channel"

/**
 * web => main
 * @param {*} channel 
 * @param  {...any} data 
 * @returns 
 */
const invokeMain = (channel, ...data) => {
    const id = Math.random()
    const p = new Promise((resolve, reject) => todoTransactions[id] = { resolve, reject })

    window.postMessage({
        channel: IPC_MAIN_REQUEST_CHANNEL + channel,
        id,
        data
    })

    return p
}

/**
 * web => preload
 * @param {*} channel 
 * @param  {...any} data 
 * @returns 
 */
const invokePreload = (channel, ...data) => {
    const id = Math.random()
    const p = new Promise((resolve, reject) => todoTransactions[id] = { resolve, reject })

    window.postMessage({
        channel: IPC_PRELOAD_REQUEST_CHANNEL + channel,
        id,
        data
    })

    return p
}

/**
 * 监听 preload 传递到 web 的信息
 * @param {*} channel 
 * @param {*} fn 
 */
const addListener = (channel, fn) => {
    if (!listeners[channel]) {
        listeners[channel] = []
    }

    listeners[channel].push(fn)
}


window.addEventListener('message', (ev) => {
    let { channel, ok, data, error, id } = ev.data
    if (!channel) return

    if (channel == IPC_RESPONSE_CHANNEL) {
        if (ok) {
            todoTransactions[id].resolve(data)
        } else {
            todoTransactions[id].reject(error)
        }
    } else if (channel.startsWith(PRELOAD_RESPONSE_CHANNEL)) {
        channel = channel.replace(PRELOAD_RESPONSE_CHANNEL, '')

        if (listeners[channel]) listeners[channel].forEach(fn => fn(...data))
    }
})

// export {
//     invokeMain,
//     invokePreload,
//     addListener,
// }