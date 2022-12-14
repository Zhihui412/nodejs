const fs = require('fs')
const path = require('path')

// 写日志
function writeLog(writeStream, log) {
    writeStream.write(log + '\n')  // key code
}
// 生成 write Stream
function createWriteStream(fileName) {
    const fullFileName = path.join(__dirname, '../../logs',fileName)
    const writeStream = fs.createWriteStream(fileName, {
        // a = append 追加写入
        flags: 'a'
    })
    return writeStream
}

// 写访问日志
const accessWriteStream = createWriteStream('access.log')
function access(log) {
    writeLog(accessWriteStream, log)
}

module.exports = {
    access
}