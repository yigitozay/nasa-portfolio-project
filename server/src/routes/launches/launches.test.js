const request = require('supertest')
const app = require('../../app')
const {mongoConnect,mongoDisconnect} = require('../../services/mongo')
const { loadPlanetsData } = require('../../models/planets.model')

describe('Launches API',()=>{

    beforeAll(async ()=>{
        await mongoConnect();
        await loadPlanetsData();
    })
    afterAll(async()=>{
        await mongoDisconnect()
    })

    describe("test GET/launches", ()=>
    {
        test('It should respond with 200 success', async ()=>{
            const response = await request(app)
            .get("/v1/launches")
            .expect('Content-Type', /json/)
            .expect(200);
        })
    })

    describe('test POST/launches' , ()=>{   

        const completeLaunchDate = {
            mission:"USS Enterpise",
            rocket:"NCC 1071",
            target:"Kepler-62 f",
            launchDate: "January 4,2028",
        }

        const launchDataWithoutDate= {
            mission:"USS Enterpise",
            rocket:"NCC 1071",
            target:"Kepler-62 f",
        }
        const launchDataWithInvalidDate = {
            mission:"USS Enterpise",
            rocket:"NCC 1071",
            target:"Kepler-62 f",
            launchDate: "zzzz",
        }

    

        test('it should catch missing required properities', async ()=> {
            const response = await request(app)
            .post("/v1/launches")
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);

            expect(response.body).toStrictEqual({
                error:'Missing required launch property'
            })
        })
        
        
        test('It should catch invalid date requests', async ()=>{
            const response = await request(app)
            .post("/v1/launches")
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);

            expect(response.body).toStrictEqual({
                error:'Invalid launch date'
            })
        })
})

})

