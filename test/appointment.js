process.env.NODE_ENV = "test"

const chai = require('chai')
const chaiHttp = require("chai-http")
chai.use(chaiHttp)
const expect = chai.expect
const app = require('../app')
const jwt = require('jsonwebtoken')


describe('GET /appointment', () => {

    let payload, cookie

    beforeEach(async ()=> {
        payload = {
            id: 1,
            email: "mevan@gmail.com",
            firstName: "mevan",
            lastName: "perera",
            role: 1,
            expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_TIME)
        }
        
        let token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET)
        cookie = 'jwt='+token
    })
    
    it('should get appointment details when given the id', async () => {
        let res = await chai 
            .request(app)
            .get('/appointment/1')
            .set('Cookie', cookie)
        expect(res).to.have.status(200)
    })

    it('should change the status of the appointment', async () => {
        let res = await chai
            .request(app)
            .post("/appointment/1/status")
            .set('Cookie', cookie)
            .send({appointment: {appointmentId: 1, status: "completed"}})

        expect(res).to.have.status(200)
    })
})

