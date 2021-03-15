var express = require('express');
var router = express.Router();
const users= require("../controllers/usersConntroller")


/* GET users listing. */
// router.get('/login', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.post('/login', users.Login);
router.post('/register', users.Register);


module.exports = router;
