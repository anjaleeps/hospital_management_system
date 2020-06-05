const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
   
const db = require('./db')
const routes = require('./routes/index')

const app = express()
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

app.set('view engine', 'ejs')

db.any("SELECT * FROM role")
    .then(function (data) {
        console.log(data)
    })
    .catch(function (err) {
        console.log(err);
    });

routes(app)

// const sendMail = require('./utll/emailTransporter')
// let diagnosisEmail = require('./util/diagnosisEmail')
// mailOptions.to = "anjaleeps.17@cse.mrt.ac.lk"
// diagnosisEmail.sendEmail()

// sendMail(mailOptions).catch(err=> {console.log(err)})

app.listen(process.env.PORT || 3000, () => console.log('hello'))


