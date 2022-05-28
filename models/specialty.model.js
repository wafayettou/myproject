const { rejects } = require('assert');
const { reject } = require('bcrypt/promises');
const mongoose=require('mongoose');
const { resolve } = require('path');
const DB_URL='mongodb://localhost:27017/doctorat-webSite';
const candidateModel=require('../models/candidate.model');
const store=require('store')
const specialtySchema=mongoose.Schema({
    nameSpecialty:String,
    materials:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'materials'
    }],
    candidates:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'candidates'
    }]
})
const Specialty=mongoose.model('Specialty',specialtySchema)
exports.getSpecialties=()=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Specialty.find({}).populate('materials')
        }).then(result=>{
            mongoose.disconnect();
            resolve(result)
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}
exports.postSpecialty=(specialty1,materialIds)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            let specialty=new Specialty({
                nameSpecialty:specialty1,
                materials:materialIds
            });
            return specialty.save();
        }).then(result=>{
            mongoose.disconnect();
            resolve(result)
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}
exports.addMaterialAndSpecialtyId=(specialty,materialIds,candidateIds)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Specialty.updateOne({nameSpecialty:specialty},{$push:{materials:materialIds},$addToSet:{candidates:candidateIds}},{upsert:true})
        }).then((result)=>{
            mongoose.disconnect();
            resolve(result)
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}
exports.getCandidateBySpecialty=(specialty)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Specialty.find({nameSpecialty:specialty}).populate('candidates').populate('materials')
        }).then((result)=>{
            mongoose.disconnect();
            resolve(result)
            
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}