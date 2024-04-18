import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import postcssPresetEnv from 'postcss-preset-env'
import postcssGlobalData from '@csstools/postcss-global-data'
import { viteMockServe } from 'vite-plugin-mock'
import autoAlias from './plugins/vite-plugin-auto-alias'
import viteHtml from './plugins/vite-plugin-html'
import viteMock from './plugins/vite-plugin-mock'

export default defineConfig(({ command, mode }) => {
  // 开发环境是 serve，生产环境是 build，取决于 vite 的执行命令，可以通过这个参数给开发和生产分开做配置
  console.log('command ==>', command)
  // 开发环境默认是 development，生产环境默认是 production，可以在启动 vite 命令添加 --mode ${xxx} 参数修改
  console.log('mode ==>', mode)

  /**
   * @desc 获取环境变量
   *  - 三个参数：
   *    - 参数一：理论上可以传递任意字符串，但是 vite 建议传递 mode，可用来区分不同的环境变量配置文件
   *    - 参数二：配置文件所在的目录
   *      - 默认配置文件：.env
   *      - 根据 mode 获取的配置文件：`.env.${mode}`
   *    - 参数三：需要读取的环境变量前缀（不传的话就是全部）
   *  - 最终的结果：
   *    - 从 process.env + .env + .env.${mode} 中筛选出所有具有 APP_ 前缀的环境变量（是个对象）
   *    - .env 和 .env.${mode} 的环境变量无法覆盖 process.env
   *    - .env 的环境变量可以被 .env.${mode} 覆盖
   *  - 如何在代码中使用环境变量？
   *    - 调用 import.meta.env，默认情况下，除了一些预设值，只能拿到以 VITE_ 作为前缀的环境变量
   *      - 是因为 vite 觉得不是所有的环境变量都需要在开发代码中使用，所以做了个限制
   *      - 这个前缀是可以通过 envPrefix 自定义的
   */
  const env = loadEnv(mode, path.resolve(__dirname, './'), 'APP_')
  console.log('env ==>', env)

  return {
    resolve: {
      // 配置路径别名
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      // exclude: ['lodash-es'], // 将数组中指定的依赖不进行依赖预构建，这将会产生大量的依赖请求
    },
    envPrefix: 'APP_', // 默认值：VITE_，只有具有此前缀的环境变量才能在开发代码中使用
    css: {
      // 可以让浏览器显示 css 样式代码所在的文件
      devSourcemap: true,
      // 可以对 css 模块化行为进行默认修改
      modules: {
        localsConvention: 'camelCase', // 生成驼峰式命名
        scopeBehaviour: 'local', // 默认值 local，设置模块化是全局还是区域，设置为全局的时候，就意味着关闭模块化
        // generateScopedName: '[name]_[local]_[hash:5]', // 生成的类名的规则，规则可以到 postcss 看，一般来讲也不会手动配置这个
        hashPrefix: 'hahaha', // 生成 hash 时会带上这个前缀去生成（默认的 hash 主要是通过类名还有其它的一些字符串生成的）
        // globalModulePaths: ['./src/css/a.module.css'], // 不想参与到 css 模块化的路径（就变成全局的了），注意：这个地方不能识别通过 path.resolve 生成的路径格式
        // globalModulePaths: [path.resolve(__dirname, './src/css/a.module.css').replaceAll('\\', '/')], // 替换后是可行的
      },
      // 可以配置 css 预处理器相关的全局参数
      preprocessorOptions: {
        // 要使用 less 需要安装 less 依赖包
        // 整个配置对象都会最终给到 less 的执行参数中去（lessc），具体有哪些参数，可以到 less 官网去看
        less: {
          math: 'always', // 将数学结果计算出来，例如：100px / 2，输出：50px
          globalVars: { // 定义全局变量
            blackColor: 'black',
          },
        },
        sass: {},
      },
      // postcss 相关配置，vite 天生支持 postcss，不需要额外安装 postcss 依赖
      postcss: {
        plugins: [
          // 将数据注入到 postcss 中，这可以让后续的插件将原生的 css 变量直接解析出来
          // 注意：这个插件一定要写在 postcssPresetEnv 插件前面，否则无效
          //  - 它只将数据注入 PostCSS，以便其他插件可以实际使用它，它不会在 CSS 的输出中添加任何内容（所以注入晚了就没用了）
          postcssGlobalData({
            files: [
              path.resolve(__dirname, './src/css/variables.css'),
            ],
          }),
          // 可以解决大多数兼容问题，例如：语法降级、前缀补全
          // 可以在 package.json 中通过 browserslist 属性配置要支持的浏览器（由 browserslist 包提供配置支持，此包已经被包含在了预设中）
          postcssPresetEnv(),
        ],
      },
    },
    // 生产配置，只对打包输出时有效
    build: {
      outDir: 'dist', // 可以修改默认的输出目录
      rollupOptions: {
        output: {
          // 入口 js 文件名（默认生成的 hash 有时后面带横杆，这是正常的）
          //  - 如果不想看到横杆，可以将 hashCharacters 设置为 base36 就没了，默认的是 base64
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'static/[name]-[hash][extname]', // 输出的资源文件名称
          // hashCharacters: 'base36', // 生成 hash 字符串的长度
        },
      },
      assetsInlineLimit: 20 * 1024, // 小于 20kb 的图片转化成 base64
    },
    plugins: [
      // 可以自动生成路径别名（自定义插件）
      autoAlias({
        rootPath: path.resolve(__dirname, './src'),
        keyName: '@',
      }),

      // 可以对 html 模板进行操作（自定义插件）
      viteHtml({
        inject: {
          data: {
            title: 'Vite',
            content: 'middle',
          },
        },
      }),

      // 可以让我们使用 mock 数据的插件
      // 需要在根目录创建文件夹 mock，然后在里面创建文件写 mock 代码
      // 此插件是依赖于 mockjs 库的
      // viteMockServe(),

      // 支持 mock 数据的使用（自定义插件）
      viteMock(),
    ],
  }
})
