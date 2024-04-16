import count from './js/count'
import _ from 'lodash'
import _es from 'lodash-es'

// 获取环境变量
const env = import.meta.env

console.log(`hello ${env.APP_NAME}`)

console.log(count(100, 200))
console.log(_.random(0, 10))
console.log(_es.random(0, 10))
