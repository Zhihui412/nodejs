const http = require('http')
// 设置端口号
const PORT = 8000

// 服务器处理程序，这里解耦合，把业务处理逻辑写在app.js
// 之后app.js中还有许多代码也会写在不同的文件中，目的是解耦合，使开发人员方便开发
const serverHandle = require('../app')

// 创建http服务器
const server = http.createServer(serverHandle)

// 监听端口号
server.listen(PORT)