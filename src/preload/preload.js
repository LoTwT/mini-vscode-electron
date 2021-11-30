const { handle } = require("./channel.js")
const fs = require("promise-fs")

handle(
  "readFile",
  async (filepath) => await fs.readFile(filepath, { encoding: "utf-8" }),
)

handle(
  "writeFile",
  async (filepath, content) => await fs.writeFile(filepath, content),
)

// 读取文件目录
handle("readDir", async (dir) => await fs.readdir(dir))
