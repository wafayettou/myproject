const specialtyModel=require('../models/specialty.model')
const hallModel=require('../models/hall.model')
exports.getHome=(req,res,next)=>{
    specialtyModel.getSpecialties().then((specialties)=>{
        hallModel.getHalls().then((halls)=>{
            res.render('home',{
                halls:halls,
                specialties:specialties,
                isAuth:req.session.user
            });
        }).catch(()=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)
    })
}