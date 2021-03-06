const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleWare = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config')
const router = express.Router()

function registerInterceptorRouter() {
  router.get('/interceptor/get', function(req, res) {
    res.end('hello ')
  })
}
function registerConfigRouter() {
  router.post('/config/post', function(req, res) {
    res.json({
      msg: `hello world`
    })
    res.end('hello ')
  })
}
function registerServerRouter() {
  router.get('/cancel/get', function(req, res) {
    res.json({
      msg: `hello world`
    })
    res.end('hello ')
  })
  router.post('/cancel/post', function(req, res) {
    res.json({
      msg: `hello world`
    })
    res.end('hello ')
  })
}
registerInterceptorRouter()
registerConfigRouter()
registerServerRouter()

router.get('/simple/get', (req, res) => {
  res.json({
    msg: `hello world`
  })
})
router.get('/base/get', (req, res) => {
  res.json(req.query)
})
router.post('/base/post', (req, res) => {
  if (Math.random() > 0.5) {
    res.json({
      msg: 'hello world'
    })
  } else {
    res.status(500)
    res.end()
  }
})
router.post('/base/buffer', (req, res) => {
  let msg = []
  req.on('data', chunk => {
    if (chunk) {
      msg.push(chunk)
    }
  })
  req.on('end', () => {
    let buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})

const app = express()
const compiler = webpack(webpackConfig)

app.use(router)
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/__build__/',
    stats: {
      colors: true,
      chunks: false
    }
  })
)

app.use(webpackHotMiddleWare(compiler))
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
const port = process.env.PORT || 8081
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
