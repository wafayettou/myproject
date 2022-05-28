const express=require('express');
const router=express.Router();
const csv= require('csvtojson');
const body_parser=require('body-parser')
const adminController=require('../controllers/admin.controller');


router.get('/wafa-houria2001',adminController.getAdminPage)
router.get('/candidates',adminController.getCandidatePage)
router.post('/deleteCandidate',body_parser.urlencoded({extended:true}),adminController.deleteCandidate)
router.post('/addCandidate',body_parser.urlencoded({extended:true}),adminController.addCandidate)
router.get('/materials',adminController.getMaterialsPage)
router.post('/addMaterials',body_parser.urlencoded({extended:true}),adminController.addMaterials)
router.post('/deleteMaterial',body_parser.urlencoded({extended:true}),adminController.deleteMaterial)
router.get('/halls',adminController.getHallsPage)
router.post('/addHall',body_parser.urlencoded({limit: '50mb', extended: true, parameterLimit: 100000000}),adminController.postHall)
router.post('/deleteHall',body_parser.urlencoded({extended:true}),adminController.deleteHall)
router.get('/deliberations',adminController.getDeliberationsPage)
router.get('/corrector',adminController.getCorrectors)
router.post('/deleteCorrector',adminController.deleteCorrector)
router.post('/addNewCorrector',adminController.addNewCorrector)
router.post('/candidates',adminController.getCandidateBySpecialty)
router.post('/downloadResult',body_parser.urlencoded({extended:true}),adminController.postDownloadResult)
router.post('/downloadCrypto',body_parser.urlencoded({extended:true}),adminController.postDownloadCrypto)
module.exports=router;