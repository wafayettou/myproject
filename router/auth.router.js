const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth.controller')
const body_parser = require('body-parser')
router.get('/signup',body_parser.urlencoded({extended:true}),authController.getauth)
router.post('/signup', body_parser.urlencoded({ extended: true }), authController.postsignup)
router.post('/signin',body_parser.urlencoded({extended:true}),authController.postsignin)
router.get('/logout',authController.logOut)
module.exports = router;