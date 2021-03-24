var express = require('express');
var router = express.Router();
const weapp= require("../controllers/weappConntroller")

router.post('/login', weapp.Login);
router.post('/dataInit', weapp.dataInit);
// router.post('/register', weapp.Register);


module.exports = router;
