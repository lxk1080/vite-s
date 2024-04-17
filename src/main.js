import count from './js/count'
import _ from 'lodash'
import _es from 'lodash-es'
import './css/variables.css'
import cssModuleA from './css/a.module.css'
import cssModuleB from './css/b.module.css'
import lessModuleA from './less/a.module.less'

// 获取环境变量
const env = import.meta.env

console.log(`hello ${env.APP_NAME}`)

console.log(count(100, 200))
console.log(_.random(0, 10))
console.log(_es.random(0, 10))

// css 模块化
console.log('cssModuleA ==>', cssModuleA)
console.log('cssModuleB ==>', cssModuleB)
console.log('lessModuleA ==>', lessModuleA)
document.getElementById('footer').className = cssModuleB.footer
document.getElementById('header').className = lessModuleA.header
document.getElementById('title').className = lessModuleA.title
