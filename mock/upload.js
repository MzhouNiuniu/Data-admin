const https = require('https');
// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  'POST /api/upload': (req, res) => {
    https.get('https://api.dujin.org/pic/', function(rRes) {
      res.send({
        name: 'xxx.png',
        status: 'done',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        url: rRes.headers.location,
      });
    });
  },
  'POST /api/upload/base64': (req, res) => {
    res.send({
      name: 'xxx.png',
      status: 'done',
      url: `https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`,
    });
  },
};
