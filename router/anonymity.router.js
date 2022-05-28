const express=require('express');
const router=express.Router();
const anonymityController=require('../controllers/anonymity.Controller')


router.get('/anonymityPage',anonymityController.getAnonymityPage)

module.exports=router;