const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')


const handleUserRouter = (req, res) => {
    const method = req.method 

    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body
        const result = login(username, password)
        return result.then(data => {
            if (data.username) {
                return new SuccessModel()
            }
            return new ErrorModel('登陆失败')
        })
    }

    // 登录验证的测试
    if (method === 'GET' && req.path === '/api/user/login-test') {
        // 如果有usernam的话
        if (req.cookie.username) {
            return Promise.resolve(
                new SuccessModel()
            )
        }
        return Promise.resolve(
            new ErrorModel('尚未登录！')
        )
    }
}

module.exports = handleUserRouter
