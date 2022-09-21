const fs = require('fs')
const path = require('path')

const fileName1 = path.resolve(__dirname, 'data1.txt')
const fileName2 = path.resolve(__dirname, 'data2.txt')

// 创建一个读取Stream
const readStream = fs.createReadStream(fileName1)
// 创建一个写入Stream
const writeStream = fs.createWriteStream(fileName2)

readStream.pipe(writeStream)

readStream.on('data', chunk => {
    console.log(chunk.toString());
})
readStream.on('end', () => {
    console.log('拷贝完成');
})
