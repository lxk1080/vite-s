import _ from 'lodash'
import _es from 'lodash-es'
import count from './js/count'
import './css/variables.css'
import cssModuleA from '@/css/a.module.css'
import cssModuleB from '@/css/b.module.css'
import lessModuleA from '@/less/a.module.less'
import pictureUrl from '@imgs/01.png?url'
import lightMp4 from '@media/light_pollution.mp4'
import viteSvg from '@svg/vite.svg?raw'
import jsonContent, { name } from '@json/index.json'
// import commomjsStr from './cjs' // 在运行时此处的路径并未被修改成预构建之后的文件路径
import str from './ts'

// 获取环境变量
const env = import.meta.env
console.log(`hello ${env.APP_NAME}`)

// ES Module + 依赖预构建
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

// 图片导入默认是 url，可以自行改变引入类型
const img = new Image()
img.src = pictureUrl
document.body.appendChild(img)

// 视频资源和图片是一样的，也是 url
;(function createVideo() {
  const video = document.createElement('video')
  video.width = 400
  video.autoplay = 'autoplay'
  video.muted = 'muted'
  video.controls = 'controls'
  video.dataset.name = '光污染'
  video.style.marginLeft = '10px'
  const source = document.createElement('source')
  source.type = 'video/mp4'
  source.src = lightMp4
  video.append(source)
  document.body.append(video)
})()

// 对于 svg 直接引入也是 url，可以放到 img.src 使用，但是我们一般还是选择直接渲染 svg 组件，所以使用 raw 方式导出字符串形式
// 使用 document.createRange().createContextualFragment() 将字符串转化成 dom 节点
document.body.appendChild(document.createElement('br'))
document.body.appendChild(document.createRange().createContextualFragment(viteSvg))
const svg = document.getElementsByTagName('svg')[0]
svg.addEventListener('mouseover', function () { this.style.fill = 'blue' })
svg.addEventListener('mouseout', function () { this.style.fill = 'black' })

// json 直接可用，并且可以按字段导入（解构）
console.log('jsonContent ==>', jsonContent)
console.log('name ==>', name)

// 测试 mock 功能（需要 vite-plugin-mock 插件或我们的自定义插件，开发环境下）
// 在 vite 中有一个兼容，如果找不着这个接口的话，会默认返回 index.html 文件（生产环境也是一样）
fetch('/api/list', { method: 'post' })
  .then((res) => {
    if (import.meta.env.APP_ENV === 'dev') {
      res.json().then((data) =>{
        console.log('data ==>', data)
      })
    }
  }).catch((err) => {
    console.log('err ==>', err)
  })

// 测试 ts 的报错功能
console.log('ts-str ==>', str)

// 测试下 proxy 的功能（开发环境下）
fetch('/baidu').then((res) => {
  console.log('%c proxy success!', 'color: green')
})

// 测试下 commonjs 模块规范
// console.log('commonjsStr ==>', commomjsStr())
