const Email = require('email-templates')
const path = require('path')
const transporter = require('./emailTransporter')
const Diagnosis = require('../models/diagnosis')
const Prescription = require('../models/prescription')
const Patient = require('../models/patient')

const email = new Email({
    transport: transporter.getTransporter(),
    preview: false,
    send: true,
    // juice: true, 
    // juiceResources: {
    //     preserveImportant: true,
    //     webResources: {
    //         relativeTo: path.join(__dirname, '..', 'public')
    //     }
    // },
    views: {
        options: {
            extension: 'ejs'
        },
        root: path.join(__dirname, "emails")
    }
})

exports.sendEmail = async function(diagnosisId){
    let patient = new Patient()
    let diagnosis = new Diagnosis()
    let prescription = new Prescription()
    
    try{
        let diagnosisData = await diagnosis.findOneById(diagnosisId)
        let prescriptionData = await prescription.findAllByDiagnosis(diagnosisId)
        let patientData = await patient.findOneById(diagnosisData.patient_id)

        let response = await email.send({
            template: 'diagnosis',
            message: {
                from: 'HMS Hospital <hms@gmail.com>',
                to: patientData.email
            },
            locals: {
                diagnosis: diagnosisData,
                prescription: prescriptionData
            }
        })
        console.log(response)
    }
    catch(err){
        console.log(err)
    }  
}

