const { handle } = require("./channel.js")
const fs = require("promise-fs")
const path = require("path")

handle(
  "readFile",
  async (filepath) => await fs.readFile(filepath, { encoding: "utf-8" }),
)

handle(
  "writeFile",
  async (filepath, content) => await fs.writeFile(filepath, content),
)

/**
 * 读取文件目录
 * 协助前端判断文件路径类型 (文件夹/文件)
 */
handle("readDir", async (dir) => {
  let ret = []

  const list = await fs.readdir(dir)
  for (let i = 0; i < list.length; i++) {
    const stat = await fs.stat(path.resolve(dir, list[i]))

    ret.push({
      name: list[i],
      isDir: await stat.isDirectory(),
    })
  }

  return ret
})
