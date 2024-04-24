/**
 * 测试下 tsc 编译：npx tsc --target es5 --module umd --lib es2015,dom .\src\ts\qwer.ts
 *  - 在使用 tsc 命令时，只有其后不加任何参数，才会使用 tsconfig.json 配置进行编译检查
 *  - 所以当我们指定编译的文件时，tsc 不会使用 tsconfig.json 的编译配置，此时需要我们自己添加一些编译参数
 */

import { random } from 'lodash'

const func = () => { console.log(123, random(0, 5)) }
export default func
