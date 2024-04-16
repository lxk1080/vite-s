## vite-s

1. 构建工具理解
    - 主要干了啥？
      - 我们写的代码一变化，自动帮我们去把 tsc、babel、less、react-compiler、uglifyjs 等全部走一遍（集成处理）
    - 承担了哪些脏活累活？
      - **模块化开发支持：支持直接从 node_modules 引入代码 + 多种模块化支持**
      - 处理代码兼容性：编译 babel、less、ts（这个不是构建工具自己做的，构建工具将这些语法对应的处理工具集成进来进行自动化处理）
      - 提高项目性能：压缩文件、代码分割
      - 优化开发体验：热更新（HMR）、开发服务器（代理，解决跨域问题）

2. vite 相比于 webpack 的优势
    - webpack 具有性能瓶颈，项目越大，webpack 需要处理的 js 代码就越多，需要很长时间才能启动开发服务器
    - 关于性能问题，webpack 能不能改？
      - 不能。。，这与 webpack 的构建原理有关
      - webpack 具有多种模块化支持，例如 esm、commonjs、umd
      - webpack 会统统编译成自己的方式：webpack_require
      - 这也就意味着，webpack 需要提前把所有的文件都读一遍，项目越大，耗费时间越长
    - vite 会替代 webpack 吗？
      - 不会
      - webpack 更多的是关注兼容性
      - 而 vite 是基于 es modules 的，更关注浏览器端的开发体验
    - 打包流程
      - 可以关注 vite 官方给的图
      - webpack 是先把所有模块都解析完，然后交给浏览器
      - vite 是按需打包，只处理浏览器需要的模块
