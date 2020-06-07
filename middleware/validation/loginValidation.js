const { check, validationResult } = require('express-validator')
const Appointment = require('../../models/appointment')
const Session = require('../../models/session')
const Diagnosis = require('../../models/diagnosis')

let appointment = new Appointment()
let session = new Session()
let diagnosis = new Diagnosis()

const loginValidationRules = function () {
    return [
        check('email').not().isEmpty().withMessage("Field cannot be empty")
            .isEmail().withMessage('Not a valid email address')
            .escape()
            .normalizeEmail(),
        check('password').not().isEmpty().withMessage('Field cannot be empty')
            .escape()
    ]
}

const validate = function (req, res, next) {
    console.log(req.body)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
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
    loginValidationRules,
    validate
}
