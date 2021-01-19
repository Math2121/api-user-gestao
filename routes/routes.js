var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UserController");
const Auth = require("../middleware/Auth")
router.get('/', HomeController.index);
router.post('/user', UserController.create)
router.get('/user',Auth, UserController.index)
router.get('/user/:id', Auth, UserController.findUser)
router.put('/user', Auth, UserController.edit)
router.delete('/user/:id', Auth, UserController.delete)
router.post('/recoverpassword', Auth, UserController.recoverPassword)
router.post('/changepassword', Auth, UserController.changPass)
router.post('/login', UserController.login)
module.exports = router;