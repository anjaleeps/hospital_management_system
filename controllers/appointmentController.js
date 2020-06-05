const Session = require('../models/session')
const Appointment = require('../models/appointment')
const Diagnosis = require('../models/diagnosis')
const Patient = require('../models/patient')

exports.getSessionAppointments = async function (req, res) {
    let sessionId = req.query.sessionId
    let date = req.query.date
    let session = new Session()
    let appointment = new Appointment()

    try {
        let sessionData = await session.findOneById(sessionId)
        if (sessionData) {
            sessionData.date = date
            let appointmentData = await appointment.findAllBySession(sessionId, date)

            res.render('appointment/list', { session: sessionData, appointments: appointmentData })
        }
        else {
            res.render('error/404')
        }

    }
    catch (err) {
        res.render('error/500')
    }
}

exports.getPatientAppointment = async function (req, res) {
    let appointmentId = req.params.appointmentId
    let appointment = new Appointment()
    let diagnosis = new Diagnosis()
    let patient = new Patient()

    try {
        let appointmentData = await appointment.findOneById(appointmentId)

        if (appointmentData) {
            if (appointmentData.status.toLowerCase() == "created") {
                let date = new Date(appointmentData.date)
                let now = new Date()
                let year = now.getFullYear()
                let month = now.getMonth()
                let d = now.getDate()
                let today = new Date(year, month, d)
            
                if (today>date) {
                    await appointment.updateStatusAuto(appointmentId)
                    appointmentData.status='missed'
                }
            }

            let patientId = appointmentData.patient_id
            let patientData = await patient.findOneById(patientId)
            let diagnosisData = await diagnosis.findAllByPatient(patientId)

            res.render('appointment/show', {
                appointment: appointmentData,
                patient: patientData,
                diagnoses: diagnosisData
            })
        }
        else {
            res.render('error/404')
        }
    }
    catch (err) {
        console.log(err)
        res.render('error/500')
    }
}

exports.changeStatus = async function (req, res) {
    let statusData = req.body.appointment
    let appointment = new Appointment()

    try {
        await appointment.updateStatus(statusData)
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        res.render('error/500')
    }
}

exports.getPatientHistory = async function(req, res){
    let doctorId = 1
    let patient= new Patient()
    try{
        let patientData = await patient.findAllByDoctor(doctorId)
        res.render('patient/list', {patients: patientData})
    }
    catch(err){
        console.log(err)
        res.render('error/500')
    }
}