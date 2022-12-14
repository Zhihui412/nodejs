const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
    console.error(err);
})

function set(key, val) {
    // 如果是对象，转换为字符串
    if (typeof val === 'object') {
        val =JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

// 异步操作
function get(key) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                console.error(err)
                return 
            }
            if (val == null) {
                resolve(null)
                return 
            }

            try {
                resolve(
                    JSON.parse(val)
                )
            } catch (ex) {
                resolve(val)
            }
        })
    })
}

module.exports = {
    set,
    get
}