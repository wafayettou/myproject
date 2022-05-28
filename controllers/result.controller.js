const { reject } = require('bcrypt/promises');
const { type } = require('express/lib/response');
const { default: mongoose } = require('mongoose');
const { resolve } = require('path');
const candidateModel = require('../models/candidate.model');
const resultModel=require('../models/result.model')
const DB_URL='mongodb://localhost:27017/doctorat-webSite';

exports.postResult=(req,res,next)=>{
    if(typeof(req.body.materialIds)=='string'){
        if(typeof(req.body.materialIds)=='string'){

            let data=[[],[],[],,]
            for(i=0;i<=req.body.candidateIds.length-1;i++){
                data[i]={notes:req.body.notes[i],marks:req.body.marks[i],candidate:req.body.candidateIds[i],materials:req.body.materialIds,specialty:req.body.specialty}
            }
            resultModel.deleteAllResults(req.body.specialty).then(()=>{
                resultModel.addNewResult(data).then(result=>{
                    res.redirect('/corrector/correctorPage')
                }).catch(err=>{
                    console.log(err)
                })
            }).catch(err=>{
                console.log(err)
            })
        }else{

            var data=[,,[],[]],dataTotal=[]
            for(i=0;i<=req.body.candidateIds.length-1;i++){
                var j=i;
                data[0]=req.body.materialIds;
                data[1]=req.body.candidateIds[i]
                for(k=j;k<=j;k++){
                    data[2].push(req.body.marks[k])
                }
                for(k=j;k<=j;k++){
                    data[3].push(req.body.notes[k])
                }
                dataTotal.push(data);
                data=[,,[],[]]
            }
            var dataFinal=[]
           
        
            for(element of dataTotal){
                let test={
                    materials:element[0],
                    candidate:element[1],
                    marks:element[2],
                    notes:element[3],
                    specialty:req.body.specialty
                }
                dataFinal.push(test)
            }
            
        }
       
    }else if(typeof(req.body.candidateIds)=='string'){

        let data={}
        data['marks']=req.body.marks;
        data['notes']=req.body.notes;
        data['candidate']=req.body.candidateIds;
        data['materials']=req.body.materialIds;
        data['specialty']=req.body.specialty
        resultModel.updateOneResult(data).then(()=>{
            res.redirect('/corrector/correctorPage')
        }).catch(err=>{
            console.log(err)
        })  
    }else{
        var data=[,,[],[]],dataTotal=[]
        for(i=0;i<=req.body.candidateIds.length-1;i++){
            var j=i*(req.body.materialIds.length);
            data[0]=req.body.materialIds;
            data[1]=req.body.candidateIds[i]
            for(k=j;k<=j+(req.body.materialIds.length-1);k++){
                data[2].push(req.body.marks[k])
            }
            for(k=j;k<=j+(req.body.materialIds.length-1);k++){
                data[3].push(req.body.notes[k])
            }
            dataTotal.push(data);
            data=[,,[],[]]
        }
        var dataFinal=[]
        for(element of dataTotal){
            let test={
                materials:element[0],
                candidate:element[1],
                marks:element[2],
                notes:element[3],
                specialty:req.body.specialty
            }
            dataFinal.push(test)
        }
        resultModel.deleteAllResults(req.body.specialty).then(()=>{
            resultModel.addNewResult(dataFinal).then(result=>{
                res.redirect('/corrector/correctorPage')
            }).catch(err=>{
                console.log(err)
            })
        }).catch(err=>{
            console.log(err)
        })
    }
       
        
}


exports.getResultByCandidate=(req,res,next)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return candidateModel.findOne({Candidate_number:req.body.candidateNumber})
        }).then(candidate=>{
            console.log('candidate: ',candidate)
            mongoose.disconnect();
            resultModel.getResultByCandidateId(candidate._id).then(result=>{
                console.log('result: ',result)
                res.render('result',{
                    candidate:candidate,
                    result:result,
                    error:null
                })
            }).catch(err=>{
                console.log(err)
            })
            resolve(candidate)
        }).catch(err=>{
            mongoose.disconnect();
            res.render('result',{
                candidate:null,
                result:null,
                error:'false number...'
            })
        })
    })
}