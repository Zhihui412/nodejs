const querystringify = require('querystringify')
const { get, set } = require('./src/db/redis')
const { access } = require('./src/utils/log')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// session 数据
const SESSION_DATA = {}

// 获取 cookie 的过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log(d.toGMTString());
    
    return d.toGMTString()
}

// 用于处理 post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        // 如果不是post请求
        if (req.method !== 'POST') {
            // 返回空
            resolve({})
            return
        }
        // 头部不是json
        if (req.headers['content-type'] !== 'application/json') {
            // 返回空
            resolve({})
            return
        }
        // 经过前两步判断，再接收数据
        // 定义postData字符串类型，接收数据
        let postData = ''
        req.on('data', chunk => {
            // 二进制格式转换为字符串
            postData += chunk.toString()
        })
        // 接收完毕，如果没有数据，则返回空
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            // 数据接收完成
            resolve(
                // 字符串格式转换为对象
                JSON.parse(postData)
            )
        })
    })
    return promise
}



const serverHandle = (req, res) => {
    // 记录 access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-ahent']} -- ${Date.now()}`)


    // 设置返回格式 JSON
    res.setHeader('Contetn-type', 'application/json')

    //设置path
    const url = req.url
    req.path = url.split('?')[0]

    // 解析 query
    req.query = querystringify.parse(url.split('?')[1])

    // 解析 cookie
    req.cookie = {} // 先定义一个cookie对象，将字符串的形式变成对象形式
    const cookieStr = req.headers.cookie || ''
    // 将字符串转换为数组
    cookieStr.split(';').forEach( item => {
        if (!item){
            return
        }
        // 再对每一项进行拆分
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        // 用req.cookie接收
        req.cookie[key] = val
    })
    
    // 解析 Session
    let needSetCookie = false
    let userId = req.cookie.userid
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        }
        req.session = SESSION_DATA[userId]
    } else {
        needSetCookie = true
        userId = ` ${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId]



    // 在处理路由之前，解析完post data
    getPostData(req).then(postData => {
        // 把处理完的数据放在req.body，方便使用
        req.body = postData



        // 处理 blog 路由
        // 用blogData 接收blog路由返回来的对象
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie',`userid=${userId};path = /;httpOnly;expires = ${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return 
        }

        // 判断如果返回不为空的，执行下面语句
        // if (blogData) {
        //     res.end(
        //         // 返回来的blogData是对象，将blogData转换为字符串
        //         JSON.stringify(blogData)
        //     )
        //     // 停止执行
        //     return
        // }



        // 处理 user 路由
        // const userData = handleUserRouter(req, res)
        // if (userData) {
        //     res.end(
        //         JSON.stringify(userData)
        //     )
        //     return
        // }
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie',`userid=${userId};path = /;httpOnly;expires = ${getCookieExpires()}`)
                }

                res.end(
                    JSON.stringify(userData)
                )
            })
            return 
        }



        // 如果url输入的路由，没有相对应的路由与之匹配，则返回404
        // 设置返回头为文本
        res.writeHead(404, { "Content-type": "text/plain" })
        // 返回数据
        res.write("404 Not Found\n")
        // 结束本次服务器响应
        res.end()
    })


}
// 模块化编程，将该函数暴露出去
module.exports = serverHandle