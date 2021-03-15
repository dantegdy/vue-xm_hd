const mysql = require('mysql');

module.exports = {
    //数据库配置
    // config: {
    //     host: '49.234.229.70',
    //     port: 3306,
    //     user: 'root',
    //     password: '123456',
    //     database: 'exapp',
    // },
    config: {
        host: 'localhost',
        port: 3306,
        user: 'exapp',
        password: '123456',
        database: 'exapp',
    },
    // 连接数据库，使用mysql连接池连接方式
    // 连接池对象
    sqlConnect: function (sql, sqlArr, callBack) {

        const pool = mysql.createPool(this.config);
        pool.getConnection((err, conn) => {
            if (err) {
                console.log("dbconfig", err);
                return;
            }
            console.log("dbconfig", "success")
            //事件驱动回调
            conn.query(sql, sqlArr, callBack);
            //释放连接
            conn.release();
        })

    },

    //promise回调
    SySqlConnect: function (sySql, sqlArr) {
        return new Promise((resolve, reject) => {
            const pool = mysql.createPool(this.config);
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    //事件驱动回调
                    conn.query(sySql, sqlArr, (err, data) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(data)
                        }
                    });
                    //释放连接
                    conn.release();
                }
            })
        }).catch((err) => {
            console.log(err);
        })
    }
}