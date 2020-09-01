const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
)

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
})

const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        type: process.env.AUTH_TYPE,
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    },
    debug: true,
    logger: true
})

exports.getTransporter = function(){
    let accessToken = oauth2Client.getAccessToken()
    transporter.accessToken = accessToken
    return transporter
}

// const sendMail = async function (mailOptions) {
//     let accessToken = oauth2Client.getAccessToken()

//     transporter.accessToken = accessToken

//     try {
//         let info = transporter.sendMail(mailOptions)
//         console.log(info)
//         transporter.close()
//     }
//     catch (err) {
//         console.log(err)
//     }
// }

// module.exports = sendMail