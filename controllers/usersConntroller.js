const dbConfig = require('../util/dbconfig')
Login = (req, res) => {
    // console.log(req)

    let data = ''
    req.on('data', chunk => {
        data += chunk
    })
    req.on('end', () => {
        // 将JSON字符串解析成对象
        data = JSON.parse(data)
        console.log(data)
        const { username, password } = data
        const sql = "SELECT user_id,username,userpic,phone,email,status,create_time FROM user where username=? and password=?";
        let sqlArray = [username, password];
        let callBack = (err, data) => {
            if (err) {
                res.send({ msg: err, type: 404 })
                return;
            } else {
                if (data.length) {
                    res.send({ type: 200, msg: data[0] })
                } else {
                    res.send({ type: 404, msg: "用户名或密码错误" })
                }
            }
        }
        dbConfig.sqlConnect(sql, sqlArray, callBack);
    })
}

Register = (req, res) => {
    let data = ''
    req.on('data', chunk => {
        data += chunk
    })
    req.on('end', async () => {
        data = JSON.parse(data)
        // console.log(data)
        const { username, password, phone } = data
        const type = await judgeUser(username, phone)
        console.log(type)
        if (!type) {
            res.send({ type: 404, msg: "用户名或手机号已存在" })
        } else {
            //可以注册
            const create_time = new Date()
            const sql = "insert into user(username,password,phone,create_time) value(?,?,?,?)";
            let sqlArray = [username, password, phone, create_time];
            let callBack = (err, data) => {
                if (err) {
                    res.send({ msg: err, type: 404 })
                    return;
                } else {
                    res.send({ type: 200, msg: '注册成功',userId:data.insertId })
                    return;
                }
            }
            dbConfig.sqlConnect(sql, sqlArray, callBack);
        }
    })
}

judgeUser = async (username, phone) => {
    const sql = "SELECT * FROM user where username=? or phone=?";
    let sqlArray = [username, phone];
    //调用promise的方法
    const data = await dbConfig.SySqlConnect(sql, sqlArray)
    // console.log(data)
    if (data.length) {
        return false
    } else {
        return true
    }
}

module.exports = {
    Login, Register
}