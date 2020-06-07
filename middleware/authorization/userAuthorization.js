const passport = require('passport')
const Session = require('../../models/session')
const Appointment = require('../../models/appointment')
const session = new Session()
const appointment =new Appointment()

exports.isLoggedIn = async function (req, res, next) {
    passport.authenticate('jwt', { session: false, failureRedirect: '/doctor/login' },
        function (err, user) {
            if (err || !user) {
                return res.redirect('/doctor/login')
            }
            req.user = user
            return next()
        }
    )(req, res, next)
}

exports.ownsSession = async function (req, res, next) {
    let sessionId = req.query.sessionId
    let doctorId = req.user.id
    let role = req.user.role

    if (role == 1){
        try{
            let sessionData = await session.findOneById(sessionId)
            if (!sessionData){
                return res.render('error/404')
            }
            if (sessionData.doctor_id == doctorId){
                return next()
            }
            return res.redirect('/doctor/login')
        }
        catch(err){
            console.log(err)
            res.render('error/500')
        }
    }
    else{
        return res.redirect('/doctor/login')
    }
}

exports.ownsAppointment = async function(req, res, next){
    let doctorId = req.user.id
    let role = req.user.role
    let appointmentId = req.params && req.params.appointmentId

    if (!appointmentId){
        appointmentId = req.body && req.body.appointmentId
    }

    if (role==1){
        try{
            let appointmentData = await appointment.findOneById(appointmentId)
            if (!appointmentData){
                return res.render('error/404')
            }
            let sessionData = await session.findOneById(appointmentData.session_id)
            if (sessionData.doctor_id == doctorId){
                return next()
            }
            return res.redirect('/doctor/login')
        }
        catch(err){
            console.log(err)
            res.render('error/500')
        }
    }
    else{
        return res.redirect('/doctor/login')
    }
}
