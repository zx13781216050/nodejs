const mysql = require('mysql')

const db = mysql.createPool({
    host: 'rm-2ze9g074whstic0ozco.mysql.rds.aliyuncs.com',
    port: '3306',
    user: 'zx0306',
    password: 'zx13781216050',
    database: 'my_db_01'
})
module.exports = db