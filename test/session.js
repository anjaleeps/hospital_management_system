process.env.NODE_ENV = "test"

const chai = require('chai')
const chaiHttp = require("chai-http")
chai.use(chaiHttp)
const expect = chai.expect
const app = require('../app')
const jwt = require('jsonwebtoken')

describe('GET /', () => {

    it('should get home page for a logged in user', async () => {
        let payload = {
            id: 1,
            email: "kelum@gmail.com",
            firstName: "kelum",
            lastName: "perera",
            role: 1,
            expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_TIME)
        }
        let token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET)
        let cookie = 'jwt='+token
        
        let res = await chai
            .request(app)
            .get('/')
            .set('Cookie', cookie)
        
        expect(res.status).to.equal(200)
    })

    it('should redirect to login page for a not logged in user', async () => {

        let res = await chai
            .request(app)
            .get('/')
            .set('Cookie', cookie)

            expect(res).to.redirectTo('\/doctor\/login')
    })

    it('should redirect to login page for a user with a expired token', async () => {
        let payload = {
            id: 1,
            email: "kelum@gmail.com",
            firstName: "kelum",
            lastName: "perera",
            role: 1,
            expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_TIME) - 7200000
        }
        let token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET)
        let cookie = 'jwt='+token
        
        let res = await chai
            .request(app)
            .get('/')
            .set('Cookie', cookie)

        expect(res).to.redirectTo('\/doctor\/login')
    })

})

