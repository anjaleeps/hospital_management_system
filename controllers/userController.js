const passport = require('passport')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Doctor = require('../models/doctor')
const doctor = new Doctor()

exports.login = async function (req, res) {
    passport.authenticate('local', { session: false }, function (err, doctorData) {
        if (err || !doctorData) {
            res.status(400).json({errors: [err]})
            return 
        }
    

        let payload = {
            id: doctorData.doctor_id,
            email: doctorData.email,
            firstName: doctorData.first_name,
            lastName: doctorData.last_name,
            role: doctorData.role_id,
            expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_TIME)
        }

        req.login(payload, { session: false }, err => {
            if (err) {
                res.status(400).json({errors: [{'login': "login error! try again"}]})
                return 
            }

            let token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET)

            res.cookie('jwt', token, { httpOnly: true, secure: false }) //change in production
            res.status(200).json({ doctorId: doctorData.doctor_id })

        })
    })(req, res)
}

