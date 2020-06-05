const Diagnosis = require('../models/diagnosis')
const DiagnosisType = require('../models/diagnosisType')
const Prescription = require('../models/prescription')
const Patient = require('../models/patient')
const Appointment = require('../models/appointment')
const Drug = require('../models/drug')
const diagnosisEmail = require('../util/diagnosisEmail')

exports.sendForm = async function(req, res){
    let appointmentId = req.body.appointmentId
    console.log(appointmentId)
    let diagnosisType = new DiagnosisType()
    let drug = new Drug()

    try{
        let drugData = await drug.findAll()
        let diagnosisTypeData = await diagnosisType.findAll()
        res.render('diagnosis/new', {
            appointmentId:appointmentId, 
            drugs: drugData,
            diagnosisTypes: diagnosisTypeData
        })
    }
    catch(err){
        console.log(err)
        res.render('error/500')
    }
}

exports.createNewDiagnosis = async function(req, res){
    let diagnosis = new Diagnosis()
    let prescription = new Prescription()
    let diagnosisData = req.body.diagnosis
    let drugs = diagnosisData.drugs
    let appointmentId = diagnosis.appointmentId

    try{
        let data = await diagnosis.create(diagnosisData)
        let diagnosisId = data.diagnosis_id
        console.log(diagnosisId)
        if (diagnosisId){
            drugs.forEach( async (drug) => {
                await prescription.create(diagnosisId, drug)
            })
            res.sendStatus(200)
            diagnosisEmail.sendEmail(diagnosisId)
        }
        else{
            res.render('error/404')
        }     
    }
    catch(err){
        console.log(err)
        res.render('error/500')
    }
}

exports.showDiagnosis = async function(req, res){
    let appointmentId = req.body.appointmentId
    let diagnosisId = req.params.diagnosisId
    let diagnosis = new Diagnosis()
    let prescription = new Prescription()

    try{
        let diagnosisData = await diagnosis.findOneById(diagnosisId)
        let prescriptionData = await prescription.findAllByDiagnosis(diagnosisId)
        res.render('diagnosis/show', {
            appointmentId: appointmentId,
            diagnosis: diagnosisData,
            prescription: prescriptionData
        })
    }
    catch(err){
        console.log(err)
        res.render('error/500')
    }
}