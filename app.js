//导入express
const express = require('express')
const { process_params } = require('express/lib/router')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})
//配置解析token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')

app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }))

//导入并使用用户路由模块
const userRouter = require('./router/user')
const Joi = require('@hapi/joi')
app.use('/api', userRouter)
//导入用户路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

//导入文章分类路由模块
const artCatesRouter = require('./router/artcate')
app.use('/my/acticle', artCatesRouter)

// 导入并使用文章路由模块
const articleRouter = require('./router/article')
// 为文章的路由挂载统一的访问前缀 /my/article
app.use('/my/article', articleRouter)

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

app.use((err, req, res, next) => {
    if (err instanceof Joi.ValidationError) return res.cc(err)
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败')
    res.cc(err)
})
app.use((err, req, res, next) => {
    if (err instanceof Joi.ValidationError) return res.cc(err)
    res.cc(err)
})

app.listen(3007, function () {
    console.log('api server runing at http://127/0/0/1:3007')
})