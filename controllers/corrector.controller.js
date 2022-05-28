function toHex(str) {
    var hexa = parseInt(str, 2).toString(16);
    return hexa;
}
function crypto(length){
    var row = [],result=[]

    for (var i = (Math.pow(2, length) - 1) ; i >= 0 ; i--) {
        for (var j = (length - 1) ; j >= 0 ; j--) {
            row[j] = (i & Math.pow(2,j)) ? 0 : 1
        }
        result[i]=row.join('')
    }
    for(i=0;i<=result.length-1;i++){
        result[i]=toHex(result[i])
    }
    
    return result;
}
const candidateModel=require('../models/candidate.model')
const specialtiesModel=require('../models/specialty.model')
const resultModel=require('../models/result.model')
const DB_URL='mongodb://localhost:27017/doctorat-webSite';
const { reject } = require('bcrypt/promises');
const { default: mongoose } = require('mongoose');
exports.getCorrectorPage=(req,res,next)=>{
    return new Promise((resolve,reject)=>{
        specialtiesModel.getCandidateBySpecialty(req.params.specialty).then((specialty)=>{

            resultModel.getResults(req.params.specialty).then((result)=>{
                if(specialty.length!=0){
                    res.render('corrector',{
                        cryptos:crypto(Math.ceil((Math.log(specialty[0].candidates.length))/(Math.log(2)))),
                        specialties:specialty,
                        results:result
                    })
                }else{
                    console.log('your specialty not exist...')
                    res.redirect('/auth/logout')
                }
            })
        })
    })
}
