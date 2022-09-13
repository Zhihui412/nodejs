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

const getDetail = (id) => {
    return {
        id: 1,
        title: '标题111',
        content: '内容111',
        createTime: '1546610491112',
        author: 'zhangsan'
    }
}

const newBlog = (blogData = {}) => {
    // blogData 是一个博客对象， 包含 title content 属性
    console.log('newBlog blogData...', blogData);
    
    return {
        id: 3 // 表示i虚拟键博客，插入到数据表里面的 id
    }
}

const updateBlog = (id, blogData = {}) => {
    // id 就是要更新博客的 id
    // blogData 是一个博客对象， 包含 title content 属性
    console.log('update blog', id, blogData);

    return true
    
}

const delBlog = (id) => {
    // id 要删除的博客的id 

    return true
}


module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}