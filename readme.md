## vite-s

1. 构建工具理解
    - 主要干了啥？
      - 我们写的代码一变化，自动帮我们去把 tsc、babel、less、react-compiler、uglifyjs 等全部走一遍（集成处理）
    - 承担了哪些脏活累活？
      - **模块化开发支持：支持直接从 node_modules 引入代码 + 多种模块化规范支持**
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
      - webpack 是先把所有模块都解析完，打包，然后交给浏览器
      - vite 是 **按需处理**，只处理浏览器需要的模块，在开发环境，是没有打包这个操作的
        - 在大部分情况下，vite 都会将模块内容替换成 js 代码，并导出 vite 处理后的数据（这也有利于 vite 去做不同模块的热更新）
        - 我们可以通过 Network 看到 vite 项目中请求的 css、vue 等文件内，写的都是 vite 处理后的 js 代码
        - 相比 webpack，vite 的这种处理，让我们在调试代码时，看到的文件结构更加清晰了

3. vite 脚手架
    - 首先 `npm create vite` 是什么？
      - 其实就是使用 `create-vite` 这个脚手架初始化 vite 项目，相当于 `npx create-vite` 安装脚手架，然后执行安装包中 `bin` 目录下的文件
    - `npm create` 是 `npm init` 的别名

4. vite 中的入口文件
    - 我们先来看看 webpack，它是以某一个 js 文件作为入口文件，然后需要一个 html 模板，最后将打包构建的 js bundle 以 script 标签形式插入到 html 中
    - 而 vite 是将 index.html 视为源码和模块图的一部分，vite 默认以当前工作目录作为根目录启动开发服务器，而 index.html 是该 vite 项目的入口文件
    - 你需要在 html 文件中手动添加具有 ES Module 标识的 script 标签，并引入 js 文件，这个 js 文件就相当于 webpack 的 entry 配置
    - 在构建时，vite 会自动在 html 中替换构建后的入口 js 文件路径
    - 为什么 vite 不像 webpack 一样搞个 js 作为入口文件？
      - 主要还是因为 vite 是按需加载的，你的 html 文件里面如果有 js 文件的引入，再做处理

5. vite 依赖预构建
    - 现代浏览器支持 ES Module，只需要在加载 js 的 script 上加上属性 type 为 module 即可
    - 但是浏览器不支持引用 node_modules 内的包，例如你在文件内写上 `import _ from 'lodash'`，浏览器是无法解析的，会报错，为什么？
      - 如果浏览器支持解析的话，那第三方包内可能还依赖其它的第三方包，其它的第三方包又依赖其它，这样的话，浏览器将会发送成百上千个请求去获取这些文件，浏览器会炸！
    - 但是使用了 vite 之后，浏览器就不会报错了，并且引入了三方包，vite 做了什么？
      - 实际上，vite 是在解决其它问题的时候，顺便把浏览器无法解析 node_modules 包的问题也给解决了，这个其它问题是什么？
      - 有的第三方包使用的不是 esm 规范，可能是 commonjs 规范（实际上很多都是），那浏览器就不认识了呀，vite 必须做一些处理
      - 这个处理的办法就是：**依赖预构建**
    - 依赖预构建做了啥？
      - 首先 vite 会找到对应的依赖，然后调用 esbuild（对 js 语法处理的一个库），**将其它规范的代码转换成 esm 规范，同时对 esm 规范的模块进行统一集成**，然后将处理后的代码放到 `node_modules/.vite/deps` 文件夹中
    - 依赖预构建解决了哪些问题？
      - 不同的第三方包会有不同的导出规范（解决的主要问题）
      - 对模块引用路径的处理上，可以直接使用 .vite/deps，方便路径重写（顺便解决了浏览器无法解析 node_modules 的问题）
      - 网络多包传输的性能问题（这也是浏览器原生的 es module 不敢支持 node_modules 的原因之一）
        - 可以配置：`optimizeDeps.exclude: ['xxx']`，让 vite 排除对指定依赖的预构建，那么此依赖内的其它依赖包将会被逐个请求
        - 有了依赖预构建以后，无论依赖包有多少个额外的 export 或 import，vite 都会尽可能的将它们集成，最后只生成一个或几个模块，大大减少了请求次数

6. vite 的配置文件
    - 为什么在 vite.config.js 中可以写 es module 语法？它难道不是由 node 执行吗？
      - 肯定是 node 执行，因为 vite 在读取 vite.config.js 的时候，会率先去解析文件语法，如果发现是 esm 规范，会直接将 esm 规范替换成 commonjs 规范
        - 但在 node 最新版本中，已经逐渐支持 esm 规范了，如果直接就支持的话，应该就不会做转换了

7. vite 是如何让浏览器可以识别 .vue 文件的？
    - 这个其实偏向小白哈，浏览器可以加载 .vue 的文件，是因为浏览器向服务器要了这个文件，服务器就给了（这里是 vite 中的开发服务器）
    - 至于为什么能执行 .vue 文件，是因为服务器返回的这个文件，它的 Content-Type 是 text/javascript，浏览器就当 js 文件处理了
    - 事实上这个 .vue 文件里面确实是 js 代码，是由 vite 编译过的，而浏览器和服务器不会管你文件名叫什么，它们只关注文件类型是啥
    - 服务器在返回文件时，响应头会给出文件类型，而浏览器就根据文件类型去处理文件，就这么简单

8. vite 中的 css 处理
   - 首先以 `.module.css` 结尾的文件会开启 css 模块化（是一种命名约定）
     - 将类名进行一定规则的替换（例如将 `.footer` 换成 `._footer_i91mu_1`）
     - 同时创建一个映射对象 `{ footer: '_footer_i91mu_1' }`
     - 将替换后的内容塞进 style 标签里，然后放进 index.html 的 head 标签中
     - 将这个以 `.module.css` 结尾的原文件内容替换成 js 脚本
     - 将创建的映射对象在脚本中进行默认导出
   - vite 天生就对 `postcss` 有良好支持
     - postcss 原本是有语法编译的功能的（使用相关预处理器插件，例如 postcss-less-engine ），只不过后来发现语法更新频繁导致插件更新也需要频繁，太麻烦，就不做支持了，我们现在只能先使用 less 或 sass 编译器编译完了，再去把结果给到 postcss（后处理器）
     - 所以目前 postcss 主要被用来做 css 语法降级、前缀补全，解决不同浏览器的兼容问题
     - 在 vite 中使用 postcss 非常简单，不需要额外安装任何包，只需要通过 `css.postcss` 直接进行配置即可

9. vite 中处理静态资源
    - 像图片视频这样的静态资源默认都会导出 url，可以自行修改其导出的数据类型
    - 对于 json 文件，导出即可用，并且支持解构引用当中的某个字段
    - 对于 svg 文件，可以使用 raw 方式导出字符串使用

10. vite 中的自定义插件
    - 相比 webpack，更简单了，而且官方文档写的也很详细：https://cn.vitejs.dev/guide/api-plugin.html
    - 手写几个自定义插件：
      - `vite-plugin-auto-alias`
        - 作用：自动配置路径别名
        - 代码：[vite-plugin-auto-alias](./plugins/vite-plugin-auto-alias/index.js)
      - `vite-plugin-html`
        - 作用：操作 html 模板
        - 代码：[vite-plugin-html](./plugins/vite-plugin-html/index.js)
      - `vite-plugin-mock`
        - 作用：支持使用 mock 数据
        - 代码：[vite-plugin-mock](./plugins/vite-plugin-mock/index.js)

11. vite 中对 ts 的支持
    - 首先，vite 天生就是支持 ts 的，但是 ts 报错时，如果不进行额外的配置，还是会正常打包运行，不会造成堵塞
      - 如果想让 ts 报错造成阻塞，需要安装插件：`vite-plugin-checker`（这个插件依赖于 typescript 库），并在 vite.config.js 进行配置
    - 配置 `vite-env.d.ts` 文件可以声明 .env 内定义的变量，这样在写 `import.meta.env` 时，就会有代码提示

12. 说一说性能优化
    - 对于构建工具而言，优化主要分为两种：构建速度优化、打包体积优化
    - 放眼整个前端来看，其实优化无外乎都是针对速度、体积、体验这三个方面，但是在前端这一大块，优化又分很多小的类型：
      - 页面性能指标
        - 首屏渲染时间（fcp），解决办法例如：
          - 懒加载
          - 缓存（强制缓存、协商缓存）
        - 页面中最大元素的加载时长（lcp），解决办法例如：
          - 压缩
          - 预加载
      - 对 js 代码优化
        - 副作用清除（定时器、各种响应事件）
        - requestAnimationFrame、requestIdleCallback 等 API 针对于 “帧” 的优化
      - 防抖节流
        - 善于使用 lodash 对有些方法是有算法优化的
      - 对循环优化
        - 例如：for 循环，将条件率先保存下来：`len = arr.length`
      - 对 css 的优化
        - 可继承的属性：能继承的就不要重复写
        - 避免过深的 css 嵌套
      - 构建工具的优化
        - 构建速度
        - 构建体积

13. vite 中的打包优化
    - 使用类似 webpack 的 splitChunks 功能：`build.rollupOptions.output.manualChunks`，做代码分割
    - 对于体积很大的文件，使用 gzip 压缩，减小文件体积，需要安装插件：`vite-plugin-compression`
      - 需要后端的支持，请求文件时，让其返回对应的 gzip 压缩包
      - 后端返回压缩包，需要设置响应头：`content-encoding => gzip`，浏览器拿到文件，会自动解压成原来的 js 文件
      - 注意：因为浏览器解压也是需要一定的时间的，所以，如果体积不是很大的话，就不用 gzip 压缩
    - 使用动态导入，就是那个 `import()` 方法，这个东西现在主要是用于动态加载路由
      - 动态加载路由组件的实现原理是啥？
        - 其实很好理解，import() 返回一个 promise，这个 promise 内部会做一个判断：当前路由是否匹配组件路由
        - 进入到对应路由了，就调用 resolve()，状态变为 fullfilled，开始加载组件
        - 从来没进入到路由，就让 promise 一直处于 pending 状态
        - 注意：这个和直接使用 import() 加载文件的原理不太一样哈，import() 加载文件是立刻加载的
    - 使用 CDN（内容分发网络）加速，使用插件：`vite-plugin-cdn-import`
      - CDN 的加速主要体现在两点：
        - 浏览器可以在最近的站点获取资源，速度肯定更快
        - 去掉了 CDN 加载的资源，自己本身的资源体积也减小了

14. vite 中做跨域代理
    - 首先有一个问题？
      - A 源向 B 源请求东西，B 源到底有没有把东西给你？
        - 其实 B 源是给了（虽然给的不一定是 A 源想要的），但是浏览器发现不同源，又把东西给拦截了，不给 A，浏览器这里是充当一个保安的角色
      - 为啥浏览器要把东西给拦截了呢？
        - 浏览器认为 A 源与 B 源不是一家的，在他两之间传递东西不安全，所以给拦了（同源策略）
      - 那 CORS 策略是做了什么？
        - B 源返回东西，并带了一句话告诉浏览器，A 源是我朋友，没问题，浏览器这才把东西给了 A
        - 这句话就是 `Access-Control-Allow-Origin` 之类的响应头
    - 使用的话很简单，配置 `server.proxy` 即可
      - 原理的话，就是使用开发服务器转发请求（服务器之间是没有同源策略的哈），这个就不多说了



<br/>持续更新。。
