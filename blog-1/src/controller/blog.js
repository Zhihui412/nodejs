const getList = (author, keyword) => {
    return [
        {
            id: 1,
            title: '标题111',
            content: '内容111',
            createTime: '1546610491112',
            author: 'zhangsan'
        },
        {
            id: 2,
            title: '标题222',
            content: '内容222',
            createTime: '1663040771775',
            author: '李四'
        }
        
    ]
}

module.exports = {
    getList
}