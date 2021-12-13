const path = require("path")
const fs = require("promise-fs")

// 插件目录
// win 操作系统级环境变量 %userprofile%
// win node => process.env.USERPROFILE
// mac/linux => process.env.HOME
const userHome = process.env.USERPROFILE || process.env.HOME
const extensionsRoot = path.resolve(userHome, ".minicode/extensions")

// 获取插件列表
const getExtensionList = async () => {
  // 1. 如果没有目录，创建目录
  await fs.mkdir(extensionsRoot, { recursive: true })

  // 2. 找到所有插件
  const plugins = await fs.readdir(extensionsRoot)

  // 3. todo 检测插件是否合法

  return plugins
}

// 解析插件
const parseExtension = async (pluginName) => {
  const pluginPath = path.resolve(extensionsRoot, pluginName)

  let packageJson

  // 1. package.json
  try {
    packageJson = JSON.parse(
      await fs.readFile(path.resolve(pluginPath, "package.json"), "utf-8"),
    )
  } catch (error) {
    console.error(error)
    return null
  }

  // 2. 具体解析
}

// 初始化插件相关
const initExtensions = async () => {
  const extensionList = await getExtensionList()

  for (let i = 0; i < extensionList.length; i++) {
    const res = await parseExtension(extensionList[i])
  }
}

module.exports = {
  initExtensions,
}
