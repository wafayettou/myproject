const { reject } = require('bcrypt/promises');
const mongoose=require('mongoose');
const { resolve } = require('path');
const DB_URL='mongodb://localhost:27017/doctorat-webSite';
const materialSchema=mongoose.Schema({
    name:String,
    labs:Number,
    specialty:String,
    candidate:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'candidates'
    },
    corrector:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Correctors'
    }
})
const Material=mongoose.model('materials',materialSchema);
exports.createNewMaterial=(data)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            let mat=new Material(data)
            return mat.save();
        }).then((mat)=>{
            mongoose.disconnect();
            resolve(mat)
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}
exports.getMaterials=()=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Material.find({})
        }).then(materials=>{
            mongoose.disconnect();
            resolve(materials)
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}
exports.deleteMaterial=(id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Material.findOneAndDelete({_id:id})
        }).then(result=>{
            mongoose.disconnect();
            resolve(result)
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}