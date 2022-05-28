const bodyParser = require('body-parser');
const express=require('express');
const router=express.Router();
const homeController=require('../controllers/home.controller');
const resultController=require('../controllers/result.controller')
const resultModel=require('../models/result.model');
router.get('/',homeController.getHome)
router.post('/getResult',bodyParser.urlencoded({extended:true}),resultController.getResultByCandidate)
module.exports=router;