const passport = require('passport')

exports.isLoggedIn = async function (req, res, next) {
    passport.authenticate('jwt', {session: false, failureRedirect:'/doctor/login'},  
        function(err, user){
            if (err || !user){
                return res.redirect('/doctor/login')
            }
            req.user = user
            return next()
        }
    )(req, res, next)
}

