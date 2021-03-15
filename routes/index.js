var express = require('express');
var router = express.Router();
const cate= require("../controllers/cateConntroller")


/* GET home page. */
router.get('/getmd', cate.getMd);
router.post('/setmd', cate.setMd);
router.post('/delmd', cate.delMd);
router.post('/savemd', cate.saveMd);


module.exports = router;
