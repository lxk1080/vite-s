/**
 * @desc 一个可以操作 html 模板的插件
 */
module.exports = (options = {}) => ({
  name: 'vite-html',
  transformIndexHtml: {
    // 指将在其它插件处理 html 之前应用，否则会因为其它插件不识别语法而报错
    order: 'pre',
    // 两个参数，html 就是模板字符串，还有个 ctx，指上下文，它在开发环境和生产环境不一样，具体看文档吧
    handler: (html) => {
      let newHtml = html
      const data = options?.inject?.data
      const exps = html.match(/<%=(.*)%>/g) // 获取所有匹配的字符串
      exps.forEach((expStr) => {
        const dataKey = expStr.match(/<%=(.*)%>/)[1].trim() // 获取括号里的字符串（只能获取第一个匹配）
        newHtml = newHtml.replace(expStr, data?.[dataKey] || '')
      })
      // 注意要 return 出去
      return newHtml
    },
  },
})
