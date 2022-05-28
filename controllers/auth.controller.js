const authModel = require('../models/auth.model')
const path=require('path')
const store=require('store')

exports.getauth = (req, res, next) => {
    res.render('auth',{store:req.session.user})
}
exports.postsignup = (req, res, next) => {
    authModel.createNewUser(
        req.body.userName,
        req.body.email,
        req.body.dateOfBirth,
        req.body.placeOfBirth,
        req.body.password,
        req.body.specialty
    ).then(()=>{
        res.redirect('/auth/signup')
    })
    
}
exports.postsignin=(req,res,next)=>{
    authModel.signin(req.body.email,req.body.password).then((result)=>{
        req.session.user=result
    }).then(()=>{
        res.redirect('/home')
    }).catch(err=>{
        console.log(err)
    })
    
}
exports.logOut=(req,res,next)=>{
    req.session.destroy()
    res.redirect('/auth/signup')
}