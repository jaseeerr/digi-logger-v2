var express = require('express');
var router = express.Router();
const userController = require("../controller/userConroller")
const userAuth = require("../auth/userAuth")
const multer = require('../helpers/multerHelper')
const multer1 = require('../helpers/multerHelper1')


/* GET login page. */
router.get('/login',userController.login);

/* POST login page. */
router.post('/login_submit',userController.postlogin);

/* GET signup page. */
router.get('/signup',userController.signup);

/* POST signup page. */
router.post('/signup_submit',userController.postsignup);
/* POST UPLOAD IMAGE*/ 
router.post('/upload',userAuth.userAuthentication,multer.single('photo'),userController.upload)

/* POST UPLOAD IMAGE*/ 
router.post('/uploadout',userAuth.userAuthentication,multer1.single('photo'),userController.upload1)



/* GET home page. */
router.get('/',userAuth.userAuthentication,userController.homepage); 

/* GET check-in page. */
router.get('/checkin',userAuth.userAuthentication,userController.checkin);

/* GET check-out page. */
router.get('/checkout',userAuth.userAuthentication,userController.checkout);


/* POST link device page. */
router.post('/linkdevice',userAuth.userAuthentication,userController.linkdevice);

/* POST link device page. */
router.post('/getfingerprint',userAuth.userAuthentication,userController.getfingerprint);

/* GET logout. */
router.get('/logout',userAuth.userAuthentication,userController.logout);


module.exports = router;
