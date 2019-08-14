import https from 'https'

export default {
  'GET /api/geo-json/:code': (req, res) => {
    const { code } = req.params
    https.get(`https://geo.datav.aliyun.com/areas/bound/${code}_full.json`, function (proxyRes) {
      if (proxyRes.statusCode !== 200) {
        res.send(null)
        return
      }
      let raw = ''
      proxyRes.on('data', function (chunk) {
        raw += chunk
      })
      proxyRes.on('end', function () {
        res.send(raw)
      })
    })

  },
}
