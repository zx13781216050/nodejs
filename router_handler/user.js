//导入数据库操作模块
const db = require('../db/index')

//导入bcryptjs
const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const config = require('../config')
//注册用户的处理函数
exports.regUser = (req, res) => {
    const userinfo = req.body
    // if (!userinfo.username || !userinfo.password) {
    //     return res.send({ status: 1, message: '用户名或密码不合法' })
    // }

    //定义SQL语句
    const sqlStr = 'select * from ev_user where username = ?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) {
            //return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        if (results.length > 0) {
            //return res.send({ status: 1, message: '用户名被占用,请更换其他用户名' })
            return res.cc('用户名被占用,请更换其他用户名')
        }
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)

        const sql = 'insert into ev_user set ?'

        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            //if (err) return res.send({ status: 1, message: err.message })
            if (err) return res.cc(err)
            //if (results.affectedRows !== 1) return res.send({ status: 1, message: '注册用户失败，请稍后再试' })
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试')
            //res.send({ status: 0, message: '注册成功' })
            res.cc('注册成功')
        })
    })



}
//登录的处理函数
exports.login = (req, res) => {
    const userinfo = req.body
    const sql = 'select * from ev_user where username=?'
    db.query(sql, userinfo.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('登录失败')
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) return res.cc('登录失败')

        const user = { ...results[0], password: '', user_pic: '' }
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        res.send({
            status: 0,
            message: '登陆成功',
            token: 'Bearer' + tokenStr
        })
    })

}