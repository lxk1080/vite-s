/**
 * @desc 一个可以自动生成路径别名的插件
 */
const fs = require('fs')
const path = require('path')

function getAutoAliasMaps(options) {
  const rootPath = options.rootPath || path.resolve('./src') // 根目录，默认取 node 执行目录下的 src
  const keyName = options.keyName || '@' // 特殊符号
  // 1、读 src 下的所有文件
  const files = fs.readdirSync(rootPath)
  // 2、如果文件类型是目录，则建立映射
  const result = {}
  files.forEach((fileName) => {
    const filePath = path.resolve(rootPath, fileName)
    if (fs.statSync(filePath).isDirectory()) {
      result[keyName + fileName] = filePath
    }
  })
  // 3、返回映射对象
  return result
}

/**
 * @param options
 *  - rootPath 根目录
 *  - keyName 特殊符号
 */
module.exports = (options = {}) => ({
  name: 'auto-alias',
  // 这里的别名配置会和 vite.config.js 内的配置进行深度合并
  config: () => ({
    resolve: {
      alias: getAutoAliasMaps(options), // 如果有 key 值相同，这里写的会覆盖掉 vite.config.js 配置文件里的
    },
  }),
})
