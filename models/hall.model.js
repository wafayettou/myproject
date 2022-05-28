const { rejects } = require('assert');
const { reject } = require('bcrypt/promises');
const mongoose=require('mongoose');
const { resolve } = require('path');
const DB_URL='mongodb://localhost:27017/doctorat-webSite';
const candidateModel=require('../models/candidate.model');
const store=require('store')
const hallSchema=mongoose.Schema({
    capacity:Number,
    localization:String,
    candidates:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'candidates'
    }]
})

const Hall=mongoose.model('hall',hallSchema)
exports.addHall=(data,candidates)=>{
    data={...data,candidates:candidates}
    return new Promise((resolve,reject)=>{
        mongoose.disconnect();
        mongoose.connect(DB_URL).then(()=>{
            let hall=new Hall(data)
            return hall.save();
        }).then(data=>{
            mongoose.disconnect();
            resolve(data)
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}
exports.getHalls=()=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Hall.find({}).populate('candidates')
        }).then(result=>{
            mongoose.disconnect();
            resolve(result)
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}
exports.deleteHallById=(id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Hall.findOneAndDelete({_id:id})
        }).then(result=>{
            mongoose.disconnect();
            resolve(result)
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}
