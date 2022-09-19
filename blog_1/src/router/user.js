const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')



const handleUserRouter = (req, res) => {
    const method = req.method 

    // 登录
    if (method === 'GET' && req.path === '/api/user/login') {
        // const { username, password } = req.body
        const { username, password } = req.query
        const result = login(username, password)
        return result.then(data => {
            if (data.username) {
                // 操作cookie
                // httpOnly 保证cookie数据只能再后端修改
                // path cookie设置生效路径
                // expires 设置cookie过期时间
                // res.setHeader('Set-Cookie',`username=${data.username};path = /;httpOnly;expires = ${getCookieExpires()}`)
                // 设置 session
                req.session.username = data.username
                req.session.realname = data.realname

                console.log(req.session);
                

                return new SuccessModel()
            }
            return new ErrorModel('登陆失败')
        })
    }

    // 登录验证的测试
    if (method === 'GET' && req.path === '/api/user/login-test') {
        // 如果有usernam的话
        if (req.session.username) {
            return Promise.resolve(
                new SuccessModel({
                    session: req.session
                })
            )
        }
        return Promise.resolve(
            new ErrorModel('尚未登录！')
        )
    }
}

module.exports = handleUserRouter
