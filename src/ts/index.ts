let str = 'ts-string'
// 用来测试 ts 报错是否可以堵塞程序运行
// str = 123
export default str

// 用来测试 vite-env.d.ts 声明文件是否生效
console.log(import.meta.env.APP_NAME)
