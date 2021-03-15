const dbConfig = require('../util/dbconfig')
//获取文档
getMd = (req, res) => {
    console.log(req.query.user_id)
    if(req.query.user_id){
        const sql = "SELECT * FROM mdbox where userid=? order by id asc ";
        let sqlArray = [req.query.user_id];
        let callBack = (err, data) => {
            if (err) {
                console.log("连接出错了");
                return;
            } else {
                res.send({
                    'list': data
                })
            }
        }
        dbConfig.sqlConnect(sql, sqlArray, callBack);
    }else{
        const sql = "SELECT * FROM mdbox order by id asc";
        let sqlArray = [];
        let callBack = (err, data) => {
            if (err) {
                console.log("连接出错了");
                return;
            } else {
                res.send({
                    'list': data
                })
            }
        }
        dbConfig.sqlConnect(sql, sqlArray, callBack);
    }
}
//新增文档
setMd = (req, res) => {
    if (req.query.userid) {
        const{userid,type,title,msg}=req.query;
        const sql = `insert into mdbox(userid,type,title,msg) value(?,?,?,?)`;
        let sqlArray = [userid,type,title,msg];
        let callBack = (err, data) => {
            if (err) {
                console.log("连接出错了");
                return;
            } else {
                res.send({
                    msg:"添加成功",
                    mdId:data.insertId
                })
            }
        }
        dbConfig.sqlConnect(sql, sqlArray, callBack);
    }
}
//删除文档
delMd = (req, res)=>{
    // console.log(req.query)
    const{id}=req.query;
    const sql=`delete from mdbox where id=?`;
    let sqlArray=[id];
    let callBack = (err, data) => {
        if (err) {
            console.log("连接出错了");
            return;
        } else {
            res.send({
                msg:"删除成功"
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArray, callBack);
}
//编辑文档
saveMd = (req, res)=>{
    console.log(req.query)
    const{id,title,msg}=req.query;
    const sql=`update mdbox set msg=? , title=? where id=?`;
    let sqlArray=[msg,title,id];
    let callBack = (err, data) => {
        if (err) {
            console.log("连接出错了");
            return;
        } else {
            res.send({
                msg:"编辑成功"
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArray, callBack);
}

module.exports = {
    getMd, setMd,delMd,saveMd
}