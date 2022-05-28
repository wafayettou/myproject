const { reject } = require('bcrypt/promises');
const mongoose=require('mongoose');
const { resolve } = require('path');
const path=require('path');
const DB_URL='mongodb://localhost:27017/doctorat-webSite';
const candidateSchema=mongoose.Schema({
    Candidate_number:String,
    Bac_number:Number,
    Note:String,
    Mark:String,
    Year_Bac:Number,
    First_name:String,
    Last_name:String,
    Birth_date:Date,
    Birth_place:String,
    Phone_number:String,
    Email:String,
    Address:String,
    Establishment:String,
    Year_of_deplom:Number,
    Curriculum_type:String,
    Sector:String,
    Speciality:String,
    Master_classification_average:String,
    Master_classification_category:String,
    Specialty_requested:String
    
})
module.exports=mongoose.model('candidates',candidateSchema);


