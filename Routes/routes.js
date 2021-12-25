const express = require('express');
const router = express.Router();
const userCtrller = require('../Controller/usersController');
const loginRegister = require('../Controller/registerLogin')
const {authorizationAccessToken, decidingToLogout} = require('../Model/Security/security');

// Creating A/C...
router.post('/login', loginRegister.login)
router.post('/register', decidingToLogout, loginRegister.register)
router.post('/logout', authorizationAccessToken, loginRegister.logOut)

// Creating stairs of blogApp ...
router.post('/blogPost', authorizationAccessToken, userCtrller.userPost)
router.get('/blogs', authorizationAccessToken, userCtrller.allBlogs)
router.post('/blogReactions/:id', authorizationAccessToken, userCtrller.likeDislikes)
router.get('/totalLD', authorizationAccessToken, userCtrller.totalLD)
// router.get('/getId', authorizationAccessToken, userCtrller.lastId)




module.exports = router;

