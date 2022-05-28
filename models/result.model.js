const { rejects } = require('assert');
const mongoose=require('mongoose');
const { resolve } = require('path');
const { populate } = require('./candidate.model');
const DB_URL='mongodb://localhost:27017/doctorat-webSite';

const resultSchema=mongoose.Schema({
    marks:[Number],
    notes:[String],
    materials:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'materials'
    }],
    candidate:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'candidates'
    },
    specialty:String
})
const Result=mongoose.model('result',resultSchema)
exports.addNewResult=(data)=>{
    
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Result.insertMany(data)
        }).then((result)=>{
            mongoose.disconnect();
            resolve(result)
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}
exports.getResultByCandidateId=(candidateId)=>{
    return  new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Result.findOne({candidate:candidateId}).populate('materials');
        }).then(result=>{
            mongoose.disconnect();
            resolve(result);
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}
exports.getResults=(param)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Result.find({specialty : param}).populate('candidate')
        }).then(result=>{
            console.log(result)
            mongoose.disconnect();
            resolve(result)
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}
exports.getResultsOrdered=()=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Result.find().sort({marks:-1}).populate('candidate').populate('materials')
        }).then(result=>{
            mongoose.disconnect();
            resolve(result)
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}
exports.deleteAllResults=(param)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Result.deleteMany({specialty:param});
        }).then(()=>{
            mongoose.disconnect()
            resolve();
        }).catch(err=>{
            mongoose.disconnect();
            reject();
        })
    })
}
exports.updateOneResult=(data)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Result.findOneAndUpdate({candidate:data.candidate},{$set:data},{upsert:true});
        }).then(()=>{
            mongoose.disconnect()
            resolve();
        }).catch(err=>{
            mongoose.disconnect();
            reject();
        })
    })
}
exports.addOneResultOfOneCandidate=(data)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            let obj=new Result(data);
            return obj.save();
            
        }).then((result)=>{
            mongoose.disconnect();
            resolve(result)
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}
exports.addNewResultOne=(data)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            let obj=new Result(data);
            return obj.save();
            
        }).then((result)=>{
            mongoose.disconnect();
            resolve(result)
        }).catch(err=>{
            mongoose.disconnect();
            reject(err)
        })
    })
}