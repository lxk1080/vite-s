/**
 * @desc 一个支持定制 mock 数据的插件
 */
const path = require('path')
const fs = require('fs')

module.exports = (options = {}) => ({
  name: 'vite-mock',
  configureServer: (server) => {
    // 使用中间件拦截请求和响应
    server.middlewares.use((req, res, next) => {
      const mockPath = options.mockPath || path.resolve('./mock/index.js') // 默认读根目录下的 mock 文件夹
      try { fs.accessSync(mockPath) } catch { return next() }
      const mockList = require(mockPath)
      const target = mockList.find((mockItem) => {
        return mockItem.url === req.url && mockItem.method.toLowerCase() === req.method.toLowerCase()
      })
      if (target) {
        // 注意这里的 res 是 node 原生对象，不能使用 send、json 方法
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify(target.response(req)))
      }
      next()
    })
  },
})
