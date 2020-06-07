const Session = require('../models/session')
const Appointment = require('../models/appointment')

exports.getSessions = async function(req, res){
    console.log(req.user)
    let doctorId = 1
    let session = new Session()

    try{
        let sessionData = await session.findAllByDoctor(doctorId)
        res.render('home', {doctorId:doctorId, sessions: sessionData})
    }
    catch(err){
        console.log(err)
        res.render('error/500')
    }
}

