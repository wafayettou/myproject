const express=require('express')
const router=express.Router();
const correctorController=require('../controllers/corrector.controller')
const resultController=require('../controllers/result.controller')
const body_parser=require('body-parser')



router.get('/correctorPage',(req,res,next)=>{
    if(req.session.user){
        res.redirect('/corrector/'+req.session.user.specialty)
    }else{
        res.redirect('/auth/signup')
    }
})
router.get('/:specialty',correctorController.getCorrectorPage)

router.post('/addNote',body_parser.urlencoded({extended:true}),resultController.postResult)
module.exports=router;