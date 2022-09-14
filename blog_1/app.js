const querystringify = require('querystringify')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

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
    // 设置返回格式 JSON
    res.setHeader('Contetn-type', 'application/json')

    //设置path
    const url = req.url
    req.path = url.split('?')[0]

    // 解析 query
    req.query = querystringify.parse(url.split('?')[1])

    // 在处理路由之前，解析完post data
    getPostData(req).then(postData => {
        // 把处理完的数据放在req.body，方便使用
        req.body = postData



        // 处理 blog 路由
        // 用blogData 接收blog路由返回来的对象
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
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