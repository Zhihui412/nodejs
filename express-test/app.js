const express = require('express')

const app = express()

app.use((req, res, next) => {
    console.log('请求开始...', req.method, req.url);
    next()
})

app.use((req, res, next) => {
    
})