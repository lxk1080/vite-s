// 定义 .env 中的变量声明，其中 vite/client.d.ts 是内置的，下面的 ImportMetaEnv 用来声明我们自己定义的环境变量，这个声明会和内置的合并
// 有了这个声明，写代码时，我们使用 import.meta.env 就会有代码提示
// 下面的是三斜杠指令，意思是引入 vite/client.d.ts 声明文件，和 import 'vite/client' 意思一样，但是这里就是规定使用这种语法

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_NAME: string
}
