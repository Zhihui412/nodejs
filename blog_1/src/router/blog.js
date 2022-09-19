const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 统一的登陆验证的函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录！')
        )
    }
}


const handleBlogRouter = (req, res) => {
    const method = req.method
    const id = req.query.id

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        // 使用之前在app.js中获取的req.query
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''

        // result接收返回来的promise对象
        const result = getList(author, keyword)

        // 返回promise对象
        return result.then(listData => {
            return new SuccessModel(listData)
        })

        // // getList返回数据，类型为数组对象
        // const listData = getList(author, keyword)
        // // 使用之前定义的resModel，封装返回的数据
        // return new SuccessModel(listData)
    }


    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        const result = getDetail(id)
        return result.then(data => {
            return new SuccessModel(data)
        })

        // const data  = getDetail(id)
        // return new SuccessModel(data)
    }
    // 新建一篇博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        // 这里的req.body就是之前解析完的postData
        // newBlog处理完返回数据，为这篇博客插入数据表中的id
        // const data = newBlog(req.body)

        // 登陆验证
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheck
        }

        // 返回封装数据
        // return new SuccessModel(data)
        req.body.author = req.session.username
        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }


    // 更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {

        // 登陆验证
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheck
        }

        const result = updateBlog(id, req.body)
        // updateBlog 返回的是布尔类型，所以直接做判断，返回封装数据
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('更新博客失败！')
            }
        })
    }


    // 删除一篇博客
    if (method === 'POST' && req.path === '/api/blog/del') {

        // 登陆验证
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheck
        }

        const author = req.session.username
        const result = delBlog(id, author)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('删除博客失败！')
            }
        })

    }

}

module.exports = handleBlogRouter