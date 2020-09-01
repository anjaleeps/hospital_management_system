process.env.NODE_ENV = "test"

const chai = require('chai')
const chaiHttp = require("chai-http")
chai.use(chaiHttp)
const expect = chai.expect
const app = require('../app')

describe('GET /login', () => {
    it('should get login form', async () => {
        let res = await chai
            .request(app)
            .get('/login')
        expect(res.status).to.equal(200)  
    })
})

describe('POST /login', () => {
    it('should log in the user with valid input', async () => {
        let res = await chai
            .request(app)
            .post('/login')
            .send({
                email: 'mevan@gmail.com',
                password: 'Nevermind123'
            })
        expect(res.status).to.equal(200)
        expect(res.body.doctorId).not.toBeNull
        expect(res).to.have.cookie("jwt")
    })

    it('should not log in the user with invalid password', async () => {
        let res = await chai
            .request(app)
            .post('/login')
            .send({
                email: 'mevan@gmail.com',
                password: 'Nevermind'
            })
            expect(res.status).to.equal(400)
            expect(res.headers["set-cookie"]).toBeNull
    })

    it('should not log in the user with invalid email', async ()=> {
        let res = await chai
            .request(app)
            .post('/login')
            .send({
                email: 'mevan123@gmail.com',
                password: 'Nevermind123'
            })
        
            expect(res.status).to.equal(400)
            expect(res.headers["set-cookie"]).toBeNull
    })
})