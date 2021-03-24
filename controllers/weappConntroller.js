const dbConfig = require('../util/dbconfig')
const axios = require('axios');
const appid = "wx4895fb9ca57b9087";
const secret = "ed8c2454388aef7c1c60f0e4950b2ba3";
Login = (req, res) => {

    // console.log(req.body)
    const { avatarUrl, nickName, code } = req.body;
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
    let http = res
    // 请求获取openid
    axios.get(url)
        .then(async res => {
            const { openid } = res.data
            const data = {}
            //获取数据库中的用户信息
            data.userInfo = await getUserInfo(avatarUrl, nickName, openid)
            if (data.userInfo) {
                // 用户信息存在
                // const userList = await getUserList(openid)
                // data.userList = userList
                http.send({ type: 200, ...data })
                return;
            } else {
                //用户不存在
                const addType = await addUser(avatarUrl, nickName, openid)
                if (addType.insertId) {
                    data.userInfo = await getUserInfo(avatarUrl, nickName, openid)
                    http.send({ type: 200, ...data })
                    return;
                }
                return;
            }
        })
}

dataInit = async (req, res) => {
    console.log(req.body)
    const {openId}= req.body
    if(openId){
        const data = await getUserList(openId)
        res.send({ type: 200, msg:"获取页面数据成功",data})

    }else{
        res.send({ type:404, msg:"用户未登录"})
    }

}

getUserList = (openId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM weapp_list where openId=? order by create_time desc ";
        let sqlArray = [openId];
        let callBack = async (err, data) => {
            if (err) {
                reject("连接出错了");
            } else {
                // listInit(data);
                resolve(listInit(data))
            }
        }
        dbConfig.sqlConnect(sql, sqlArray, callBack);
    })
}

listInit = (data) => {
    let date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const week = date.getDay();// 周几
    const nowDay = [year, month, day].map(formatNumber).join('')// 年月日
    const nowMonth = [year, month].map(formatNumber).join('')// 年月
    const weekStart = Number(nowDay) - week + 1 //本周开始日期
    const weekEnd = weekStart + 6 //本周结束日期
    const dayList = []
    const weekList = []
    const monthList = []
    const yearList = []
    for (let item of data) {
        const create_date = item.create_time
        const create_year = create_date.getFullYear()
        const create_month = create_date.getMonth() + 1
        const create_day = create_date.getDate()
        const createDay = [create_year, create_month, create_day].map(formatNumber).join('')// 年月日
        const createMonth = [create_year, create_month].map(formatNumber).join('')// 年月
        if (createDay == nowDay) {
            dayList.push(item)
        }
        if (createMonth == nowMonth) {
            monthList.push(item)
            if (createDay >= weekStart && createDay <= weekEnd) {
                weekList.push(item)
            }
        }
        if (create_year == year) {
            yearList.push(item)
        }
    }
    return {
        dayList: dayList,
        weekList: weekList,
        monthList: monthList,
        yearList: yearList,
        allList:data
    }
}
// 单个数字前面加0
formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

addUser = (avatarUrl, nickName, openId) => {
    return new Promise((resolve, reject) => {
        const sql = "insert into weapp_user (openId,nickName,avatarUrl) value(?,?,?)";
        let sqlArray = [openId, nickName, avatarUrl];
        let callBack = (err, data) => {
            if (err) {
                console.log("添加失败")
                reject(err);
            } else {
                console.log("添加用户信息成功")
                resolve(data)
            }
        }
        dbConfig.sqlConnect(sql, sqlArray, callBack);
    })

}

updataUserInfo = (avatarUrl, nickName, openId) => {
    return new Promise((resolve, reject) => {
        const sql = `update weapp_user set avatarUrl=? , nickName=? where openId=?`;
        let sqlArray = [avatarUrl, nickName, openId];
        let callBack = (err, data) => {
            if (err) {
                reject(err);
                return;
            } else {
                console.log("用户信息更新成功")
                resolve(data);
            }
        }
        dbConfig.sqlConnect(sql, sqlArray, callBack);
    })
}

let getUserInfo = (avatarUrl, nickName, openId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT openId,nickName,avatarUrl FROM weapp_user where openId=? ";
        let sqlArray = [openId];
        let callBack = async (err, data) => {
            if (err) {
                reject("连接出错了");
            } else {
                console.log("获取用户信息成功")
                const Data = data[0];
                if (Data.avatarUrl == avatarUrl && Data.nickName == nickName) {
                    console.log("用户信息完全匹配")
                    resolve(Data)
                } else {
                    console.log("用户信息有待更新")
                    await updataUserInfo(avatarUrl, nickName, openId).then(async () => {
                        const Data = await getUserInfo(avatarUrl, nickName, openId)
                        resolve(Data)
                    })
                }
            }
        }
        dbConfig.sqlConnect(sql, sqlArray, callBack);
    })
}

module.exports = {
    Login,dataInit
}