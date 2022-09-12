const http = require('http');
const { chunk } = require('lodash');
const querystring = require('querystring')

const server = http.createServer((req, res)  => {
    const method = req.method
    const url = req.url
    const path = url.split('?')[0]
    const query = querystring.parse(url.split('?')[1])

    // 设置返回格式为JSON
    res.setHeader('Content-type', 'application/json')

    //返回的数据
    const resData = {
        method,
        url,
        path,
        query 
    }

    // 返回
    if (method === 'GET') {
        res.end(
            JSON.stringify(resData)
        )
    }
    if (method === 'POST') {
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            resData.postData = postData
            // 返回 
            res.end(
                JSON.stringify(resData)
            )
        })
    }
})


server.listen(8000)
console.log('OK');














// const server = http.createServer((req, res) => {
//     console.log(req.method);
//     const url = req.url
//     console.log('这里是url:', url);
//     // 将字符串转换成对象
//     req.query = querystring.parse(url.split('?')[1])
//     console.log('这里是query:', req.query);
//     res.end(
//         // 将对象转换成字符串
//         JSON.stringify(req.query)
//     )
// })

// const server = http.createServer((req, res) => {
//     if (req.method === 'POST') {
//         // req数据格式
//         console.log('req content-type: ', req.headers['content-type']);
//         // 接收数据
//         let postData = ''
//         //监听数据，一直接收数据，拼接成字符串
//         req.on('data', chunk => {
//             //chunk 本身是二进制格式
//             postData += chunk.toString()
//         })
//         // 结束时，打印postData
//         req.on('end', () => {
//             console.log('postData: ', postData);
//             res.end('hello world ! ')
//         })
        
//     }

// })

