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
const candidateModel=require('../models/candidate.model');
const csv=require('csvtojson');
const materialModel=require('../models/material.model')
const { redirect } = require('express/lib/response');
const hallModel=require('../models/hall.model');
const specialtyModel=require('../models/specialty.model')
const store=require('store');
const { default: mongoose } = require('mongoose');
const resultModel=require('../models/result.model')
const authModel=require('../models/auth.model');
const { reject } = require('bcrypt/promises');
const DB_URL='mongodb://localhost:27017/doctorat-webSite';
var XLSX = require('xlsx');
var path   = require('path');

exports.getAdminPage=(req,res,next)=>{
    res.render('admin')
}
exports.getCandidatePage=(req,res,next)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return candidateModel.find({})
        }).then((result)=>{
            mongoose.disconnect();
            res.render('candidate',{
                cryptos:crypto(Math.ceil((Math.log(result.length))/(Math.log(2)))),
                candidates:result,
                byCategory:false
            })
            redirect('/admin/candidates')
        }).catch(err=>{
            mongoose.disconnect();
            console.log(err)
        })
    })
    
}
exports.getCandidateBySpecialty=(req,res,next)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return candidateModel.find({Speciality:req.body.specialty})
        }).then((result)=>{
            mongoose.disconnect();
            res.render('candidate',{
                cryptos:crypto(Math.ceil((Math.log(result.length))/(Math.log(2)))),
                candidates:result,
                byCategory:true
            })
            redirect('/admin/candidates')
        }).catch(err=>{
            mongoose.disconnect();
            console.log(err)
        })
    })
}

exports.deleteCandidate=(req,res,next)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return candidateModel.findOneAndDelete({_id:req.body.id})
        }).then((result)=>{
            mongoose.disconnect();
            res.redirect('/admin/candidates')
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}


exports.addCandidate=(req,res,next)=>{
    candidateModel.insertMany(req.body,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/admin/candidates');
        }
    });
}
exports.getCorrectors=(req,res,next)=>{
    authModel.getAllCorrectors().then(correctors=>{
        res.render('correctors',{correctors:correctors})
    }).catch(err=>{
        console.log(err)
    })
}
exports.postSpecialty=(req,res,next)=>{
    var materialIds=[]
    if(typeof(req.body.materialIds)=='string'){
        if(req.body.materialSpecialty==req.body.specialty){
            materialIds[0]=req.body.materialIds;
        }
    }else{
        for(i=0;i<=req.body.materialIds.length;i++){
            if(req.body.materialSpecialty[i]==req.body.specialty){
                materialIds[i]=req.body.materialIds[i];
            }
        }
    }
    materialIds=materialIds.filter(n=>n)
    specialtyModel.postSpecialty(req.body.specialty,materialIds).then(()=>{
        res.redirect('/admin/materials')
    }).catch(err=>{
        console.log(err)
    })
}
exports.deleteCorrector=(req,res,next)=>{
    authModel.deleteCorrector(req.body.id).then(()=>{
        res.redirect('/admin/corrector')
    }).catch(err=>{
        console.log(err)
    })
}
exports.addNewCorrector=(req,res,next)=>{
    authModel.createNewUser(req.body.userName,req.body.email,req.body.password,req.body.specialty).then(()=>{
        res.redirect('/admin/corrector')
    }).catch(err=>{
        console.log(err)
    })
    console.log(req.body)
}
exports.getMaterialsPage=(req,res,next)=>{
    materialModel.getMaterials().then(result=>{
        return new Promise((resolve,reject)=>{
            mongoose.connect(DB_URL).then(()=>{
                return candidateModel.find({})
            }).then(candidates=>{
                mongoose.disconnect();
                res.render('materials',{
                    materials:result,
                    candidates:candidates
                })
            }).catch(err=>{
                mongoose.disconnect();
                console.log(err)
            })
        })
        
    }).catch(err=>{
        console.log(err)
    })
}
exports.deleteMaterial=(req,res,next)=>{
    materialModel.deleteMaterial(req.body.id).then(()=>{
        res.redirect('/admin/materials')
    })
}
exports.addMaterials=(req,res,next)=>{
    let candidateIds=[];
    let material={name:req.body.name,labs:req.body.labs,specialty:req.body.specialty}
    for(i=0;i<=req.body.candidateIds.length;i++){
        if(req.body.specialty==req.body.specialtyCandidates[i]){
            candidateIds[i]=req.body.candidateIds[i]
        }
    }
    candidateIds=candidateIds.filter(n=>n)
    materialModel.createNewMaterial(req.body).then(result=>{
        specialtyModel.addMaterialAndSpecialtyId(result.specialty,result._id,candidateIds).then(()=>{
            res.redirect('/admin/materials')
        }).catch(err=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)
    })
}
exports.getHallsPage=(req,res,next)=>{
    hallModel.getHalls().then(halls=>{
        materialModel.getMaterials().then((materials)=>{
            return new Promise((resolve,reject)=>{
                mongoose.connect(DB_URL).then(()=>{
                    return candidateModel.find({})
                }).then(candidates=>{
                    mongoose.disconnect();
                    res.render('halls',{candidates,halls,materials})
                }).catch(err=>{
                    mongoose.disconnect();
                    reject(err)
                })
            })
        })
    })
}
let capacityT={}

exports.postHall=(req,res,next)=>{
    let halls={
        capacity:req.body.capacity,
        localization:req.body.localization
    }
    if(capacityT[req.body.specialty]==undefined){
        capacityT[req.body.specialty]=0;
    }
    let candidatesInputs=req.body.candidatesInputs;
    let specialties=req.body.specialties;
    let candidates=[];
    for(i=0;i<=candidatesInputs.length-1;i++){
            if(specialties[i]==req.body.specialty){
                candidates[i]=candidatesInputs[i];
            }
    }
    candidates=candidates.filter(n=>n)
    candidates=candidates.slice( capacityT[req.body.specialty], capacityT[req.body.specialty]+parseInt(req.body.capacity))
    capacityT[req.body.specialty]=parseInt(capacityT[req.body.specialty])+parseInt(req.body.capacity)
    hallModel.addHall(halls,candidates).then(result=>{
        res.redirect('/admin/halls')
    }).catch(err=>{
        console.log(err)
    }) 
}
exports.deleteHall=(req,res,next)=>{
    capacityT[req.body.specialty]=capacityT[req.body.specialty]-parseInt(req.body.capacity)
    hallModel.deleteHallById(req.body.id).then(()=>{
        res.redirect('/admin/halls')
    }).catch(err=>{
        console.log(err)
    })
}
var XLSX = require('xlsx');
var path   = require('path');

exports.postDownloadResult=(req,res,next)=>{
    resultModel.getResultsOrdered().then((results)=>{
        var wb = XLSX.utils.book_new(); //new workbook
        let b=[];
        for(result of results){
            var moy=0;
            for(mark of result.marks){
                moy=(moy+mark);
            }
            moy=moy/result.marks.length
            let a={
                First_name:result.candidate.First_name,
                Last_name:result.candidate.Last_name,
                moy:moy,
                Birth_date:result.candidate.Birth_date,
                Candidate_number:result.candidate.Candidate_number,
            }
            b.push(a)
        }
        b.sort((a,b)=>{
            return b.moy-a.moy;
        })
        var temp = JSON.stringify(b);
        temp = JSON.parse(temp);
        var ws = XLSX.utils.json_to_sheet(temp);
        var down = __dirname+'..\public\exportdata.xlsx'
        XLSX.utils.book_append_sheet(wb,ws,"sheet1");
        XLSX.writeFile(wb,down);
        res.download(down);
    }).catch(err=>{
        console.log(err)
    })
}
exports.postDownloadCrypto=(req,res,next)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return candidateModel.find({Speciality:req.body.specialtyInput})
        }).then((results)=>{
            mongoose.disconnect();
            let resultD=crypto(Math.ceil((Math.log(results.length))/(Math.log(2))))
            var b=[],i=0;

            for(result of results){
                let a={}
                a['Candidate_number']=result.Candidate_number;
                a['First_name']=result.First_name;
                a['Last_name']=result.Last_name;
                a['crypto']=resultD[i];
                b.push(a);
                i++;
            }
            var wb = XLSX.utils.book_new();
           
            var temp = JSON.stringify(b);
            temp = JSON.parse(temp);
            var ws = XLSX.utils.json_to_sheet(temp);
            var down = __dirname+'..\public\exportdata.xlsx'
            XLSX.utils.book_append_sheet(wb,ws,"sheet1");
            XLSX.writeFile(wb,down);
            res.download(down);
        }).catch(err=>{
            mongoose.disconnect();
            console.log(err)
        })
    })
}
exports.getDeliberationsPage=(req,res,next)=>{
    resultModel.getResultsOrdered().then(results=>{
        let b=[];
        for(result of results){
            console.log('result:',result)
            var labs=0;
            for(material of result.materials){
                labs=labs+material.labs;
            }
            var moy=0;
            var i=0;
            for(mark of result.marks){
                moy=(moy+mark*result.materials[i].labs);
                i++;
            }
            moy=moy/labs
            let a={
                materials:result.materials,
                candidate:result.candidate,
                marks:result.marks,
                specialty:result.specialty,
                moy:moy
            }
            b.push(a)
        }
        b.sort((a,b)=>{
            return b.moy-a.moy;
        })
        res.render('deliberations',{
            results:b
        })
    })
}