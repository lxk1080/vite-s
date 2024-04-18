// 这个 mockjs 库是在安装 vite-plugin-mock 时自带的
const mockjs = require('mockjs')

// 生成 30 条数据
const list = mockjs.mock({
  'data|30': [{
    name: '@cname',
    time: '@time',
    date: '@date',
    img: mockjs.Random.image(),
  }],
})

module.exports = [
  {
    url: '/api/list',
    method: 'post',
    response: ({ body }) => ({
      code: 200,
      msg: 'success',
      data: list.data,
    }),
  },
]
