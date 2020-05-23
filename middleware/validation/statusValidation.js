const { check, validationResult } = require('express-validator')
const Appointment = require('../../models/appointment')
const Session = require('../../models/session')
const Diagnosis = require('../../models/diagnosis')

let appointment = new Appointment()
let session = new Session()
let diagnosis = new Diagnosis()

const reqFormatter = function (req, res, next) {
    req.body.appointmentId = req.body.appointment.appointmentId
    req.body.status = req.body.appointment.status
    next()
}

const statusValidationRules = function () {
    let today = new Date()
    return [
        check('appointmentId').custom(async appointmentId => {
            console.log('2')
            return appointment.findOneById(appointmentId).then(async app => {
                console.log('3')
                if (!(app)) {
                    return Promise.reject("Invalid appointment ID")
                }
                let s = await session.findOne(app.session_id)
                console.log('1')
                let date = new Date(`${app.date} ${s.start_time}`)
                let now = new Date()
                if (date > now) {
                    return Promise.reject("Cannot complete appointments before the session")
                }
                if (!(date.getFullYear() == now.getFullYear() && date.getMonth() == now.getMonth() && date.getDate() == now.getDate())) {
                    return Promise.reject("Cannot change appointment status after the appointment date")
                }

            })
        }),
        check('status').custom(async (status, { req }) => {
            let st = status.toLowerCase()
            if (!(st == 'created' || st == 'missed' || st == 'completed')) {
                return Promise.reject("Invalid status")
            }
            return appointment.findOneById(req.body.appointmentId).then(app => {
                if (app.status.toLowerCase() == 'completed') {
                    return diagnosis.findAllByAppointment(req.body.appointmentId).then(list => {
                        if (list.length) {
                            return Promise.reject("Cannot change the status of an appointment with diagnosis reports")
                        }
                    })
                }
            })
        })
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
    statusValidationRules,
    validate
}
