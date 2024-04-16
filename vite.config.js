import { defineConfig, loadEnv } from 'vite'
import path from 'path'

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
    optimizeDeps: {
      // exclude: ['lodash-es'], // 将数组中指定的依赖不进行依赖预构建，这将会产生大量的依赖请求
    },
    envPrefix: 'APP_', // 默认值：VITE_，只有具有此前缀的环境变量才能在开发代码中使用
  }
})
