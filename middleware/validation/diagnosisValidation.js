const { check, validationResult } = require('express-validator')
const Diagnosis = require('../../models/diagnosis')
const Appointment = require('../../models/appointment')
const DiagnosisType = require('../../models/diagnosisType')
const Drug = require('../../models/drug')

const diagnosis = new Diagnosis()
const appointment = new Appointment()
const diagnosisType = new DiagnosisType()
const drug = new Drug()

const reqFormatter = function (req, res, next) {
    req.body.appointmentId = req.body.diagnosis.appointmentId
    req.body.diagnosisTypeId = req.body.diagnosis.diagnosisTypeId
    req.body.drugs = req.body.diagnosis.drugs
    req.body.specialNote = req.body.diagnosis.specialNote
    next()
}

const diagnosisValidationRules = function () {
    return [
        check('appointmentId').custom(async appointmentId => {
            return appointment.findOneById(appointmentId).then(app => {
                if (!(app)) {
                    return Promise.reject("Appointment does not exist")
                }
                if (app.status.toLowerCase() != 'completed') {
                    return Promise.reject("Appointment status must be set to complete to add diagnosis reports")
                }
                let date = app.date
                let d = new Date(date)
                let today = new Date()
                console.log(d)
                console.log(today)
                if (!(d.getFullYear()==today.getFullYear() && d.getMonth()==today.getMonth() && d.getDate()==today.getDate())){
                    return Promise.reject("Cannot add dagnosis report for the old appointments")
                }

            })
        }),
        check('diagnosisTypeId').custom(async diagnosisTypeId => {
            return diagnosisType.findOneById(diagnosisTypeId).then(dt => {
                if (!dt) {
                    return Promise.reject("Invalid Diagnosis Type")
                }
            })
        }),
        check('drugs').custom(async drugs => {
            drugs.forEach(async drugId => {
                return drug.findOneById(drugId).then(d => {
                    if (!d) {
                        return Promise.reject('Invalid drug type')
                    }
                })
            })
        }),
        check('specialNote').trim().escape(),
    ]
}

const validate = function (req, res, next) {
    console.log(req.body)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        console.log('going forward')
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => {
        extractedErrors.push({ [err.param]: err.msg })
    })
    console.log(extractedErrors)
    return res.status(422).json({
        errors: extractedErrors
    })
}

module.exports = {
    reqFormatter,
    diagnosisValidationRules,
    validate
}
