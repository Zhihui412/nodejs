const http = require('http')
const slice = Array.prototype.slice

class LikeExpress {
    constructor() {
        // 存放中间件的列表
        this.routes = { // 存放中间件
            all: [],    // app.use(...)
            get: [],    // app.get(...)
            post:[]     // app.post(...)
        }
    }
// 异步函数中的回调函数的this指向是window，所以需要call或者apply来指定
    // 获取第一个参数
    register(path) {
        const info = {}
        if (typeof path === 'string') {
            info.path = path
            // 从第二个参数开始，以数组的形式存放在stack中
            info.stack = slice.call(arguments, 1 )
        } else {
            info.path = '/'
            // 从第一个参数开始，转换为数组，存入stack
            info.stack = slice.call(arguments,0)
        }
        return info
    }



    use() {
        // 将当前函数的所有参数传入到register中
        const info = this.register.apply(this, arguments)
        this.routes.all.push(info)
    }

    get() {
        const info = this.register.apply(this, arguments)
        this.routes.get.push(info)
    }

    post() {
        const info = this.register.apply(this, arguments)
        this.routes.post.push(info)
    }


    match(method, url) {
        let stack = []
        if (url === '/favicon.ico') {
            return stack
        }

        // 获取 routes
        let curRoutes = []
        curRoutes = curRoutes.concat(this.routes.all)
        curRoutes = curRoutes.concat(this.routes[method])

        curRoutes.forEach(routeInfo => {
            if (url.indexOf(routeInfo.path) === 0) {
                stack = stack.concat(routeInfo.stack)
            }
        })
        return stack
    }

    // 核心的 next 机制
    handle(req, res, stack) {
        const next = () => {
            // 拿到第一个匹配的中间件
            const middleware = stack.shift()
            if (middleware) {
                // 执行中间件函数
                middleware(req, res, next)
            }
        }
        // 立马执行
        next()
    }

    callback() {
        return (req, res) => {
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json')
                res.end(
                    JSON.stringify(data)
                )
            }
            const url = req.url
            const method = req.method.toLowerCase()

            const resultList = this.match(method, url)
            this.handle(req, res, resultList)
        }
    }


    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

// 工厂函数：产生一个新的对象，返回回去
module.exports = () => {
    return new LikeExpress() 
}