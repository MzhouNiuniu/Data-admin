const https = require('https')
// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  'POST /api/login': (req, res) => {
    res.send({
      code: 200,
      message: '账户名异常',
      data: {
        id: 10,
        role: 1,
        name: '淘淘宝',
        nick: '水水水水水',
        avatar: 'https://ws1.sinaimg.cn/large/466f79e8ly1fw5oiakucrj213m0t7wxl.jpg',
      },
    })
  },
}
