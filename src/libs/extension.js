const path = require("path")
const fs = require("promise-fs")
const { setGlobal } = require("./globals")

// 插件目录
// win 操作系统级环境变量 %userprofile%
// win node => process.env.USERPROFILE
// mac/linux => process.env.HOME
const userHome = process.env.USERPROFILE || process.env.HOME
const extensionsRoot = path.resolve(userHome, ".minicode/extensions")

// 获取插件列表
async function getExtensionList() {
  // 1. 如果没有目录，创建目录
  await fs.mkdir(extensionsRoot, { recursive: true })

  // 2. 找到所有插件
  const plugins = await fs.readdir(extensionsRoot)

  // 3. todo 检测插件是否合法

  return plugins
}

// 解析插件
async function parseExtension(pluginName) {
  const pluginPath = path.resolve(extensionsRoot, pluginName)
  const ret = {}

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
  // 2.1 判断插件信息
  for (let i = 0; i < packageJson.categories.length; i++) {
    const category = packageJson.categories[i]
    if (!parserCategories[category]) {
      console.warn(`unknown plugin category: ${category}`)
      return
    }

    await parserCategories[category](packageJson, pluginPath, ret)
  }

  return ret
}

const parserCategories = {
  Themes: parseThemePlugin,
}

// 解析主题插件
async function parseThemePlugin(packageJson, pluginPath, ret) {
  if (!ret.themes)
    ret.themes = [{ label: "default", uiTheme: "vs-dark", path: null }]

  try {
    for (let i = 0; i < packageJson.contributes.themes.length; i++) {
      const theme = packageJson.contributes.themes[i]
      theme.path = path.resolve(pluginPath, theme.path)

      ret.themes.push(theme)
    }
  } catch (error) {
    console.warn(`parse theme plugin error`, pluginPath)
    console.error(error)
  }
}

function mergeExtensions(arr) {
  const res = {}

  arr.forEach((extension) => {
    for (let key in extension) {
      if (res[key]) {
        res[key] = res[key].concat(extension[key])
      } else {
        res[key] = extension[key]
      }
    }
  })

  return res
}

// 初始化插件相关
const initExtensions = async () => {
  const extensionList = await getExtensionList()
  let extensionResults = []

  for (let i = 0; i < extensionList.length; i++) {
    const res = await parseExtension(extensionList[i])
    extensionResults.push(res)
  }

  extensionResults = mergeExtensions(extensionResults)

  setGlobal("themes", extensionResults.themes)
}

module.exports = {
  initExtensions,
}
