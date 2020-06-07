const session = require('./session')
const appointment = require('./appointment')
const diagnosis = require('./diagnosis')
const patient = require('./patient')
const user = require('./user')
const passport = require('passport')
const authorization = require('../middleware/authorization/userAuthorization')

module.exports = function (app) {
    app.use('/appointment/:appointmentId/diagnosis', authorization.isLoggedIn,
        function (req, res, next) {
            req.body.appointmentId = req.params.appointmentId
            next()
        }, authorization.ownsAppointment, diagnosis)
    app.use('/appointment', authorization.isLoggedIn, appointment)
    app.use('/patient', authorization.isLoggedIn, patient)
    app.use('/login', user)
    app.use('/', session)
}

