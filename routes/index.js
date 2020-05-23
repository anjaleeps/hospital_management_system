const session = require('./session')
const appointment = require('./appointment')
const diagnosis = require('./diagnosis')
const patient = require('./patient')

module.exports = function (app) {
    app.use('/appointment/:appointmentId/diagnosis', function(req, res, next){
        req.body.appointmentId = req.params.appointmentId
        next()
    }, diagnosis)
    app.use('/appointment', appointment)
    app.use('/patient', patient)
    app.use('/', session)
} 

