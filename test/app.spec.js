const app = require('../src/app')
const knex = require('knex')
const {makeItemsArray} = require('./items.fixtures')

describe('App', () =>{
    it('GET / responds with 200 containing "Hello, World"', () => {
        return supertest(app)
            .get('/')
            .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
            .expect(200, 'Hello, world!')
    })
})
describe(`items endpoints`, function(){
    let db 
    before(`make knex instance`, () =>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })
    after(`disconnect from the db`, ()=> db.destroy())
    before('clean the table', ()=>db('items').truncate())
    afterEach(`cleanup`, ()=> db('items').truncate())

    describe(`GET /api/items`, ()=> {
        context(`given no items`, ()=>{
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/items')
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, [])
            })
        })
        context(`given items`, ()=>{
            const testItems = makeItemsArray()
            beforeEach(`insert items`, () => {
                return db
                    .into('items')
                    .insert(testItems)
            })
            it(`responds 200 with all items`, () => {
                return supertest(app)
                    .get('/api/items')
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, testItems)
            })
        })
    })
    describe(`GET api/items/confirmation`, () => {
        context(`given no items`, () => {
            it(`responds 404`, () => {
                const testConfirmation = 777
                return supertest(app)
                    .get(`/api/items/${testConfirmation}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(404)
            })
        })
        context(`given items`, () => {
            const testItems = makeItemsArray()
            beforeEach('insert itens', () => {
                return db   
                    .into('items')
                    .insert(testItems)
            })
            it(`responds 200 with the desirered item`, () => {
                const testConfirmation = 1
                const expectedItem = testItems[testConfirmation-1]

                return supertest(app)
                    .get(`/api/items/${testConfirmation}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, expectedItem)
            })
        })
    })
    describe(`POST /api/items`, () => {
        it(`creates a new item responding with 201 and the new item`, () => {
            const newItem = {
                    confirmation: '111',
                    city: 'Saint Paul',
                    business: 'test',
                    phone: '555-555-5555',
                    itemtype: 'Clothing',
                    description: `red, hat`,
            }
            return supertest(app)
                .post('/api/items')
                .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                .send(newItem)
                .expect(201)
                .expect(res => {
                    expect(res.body.confirmation).to.eql(newItem.confirmation)
                    expect(res.body.city).to.eql(newItem.city)
                    expect(res.body.business).to.eql(newItem.business)
                    expect(res.body.phone).to.eql(newItem.phone)
                    expect(res.body.itemtype).to.eql(newItem.itemtype)
                    expect(res.body.description).to.eql(newItem.description)
                })
                .then(postRes =>
                        supertest(app)
                            .get(`/api/items/${postRes.body.confirmation}`)
                            .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                            .expect(postRes.body)
                    )
        })
        const requiredFields = ['city', 'business', 'phone', 'itemtype', 'confirmation', 'description']
        requiredFields.forEach(field => {
            const newItem = {
                confirmation: '111',
                city: 'Saint Paul',
                business: 'test',
                phone: '555-555-5555',
                itemtype: 'Clothing',
                description: `red, hat`,
            }
            it(`responds 400 when ${field} missing`, () => {
                delete newItem[field]

                return supertest(app)
                    .post('/api/items')
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .send(newItem)
                    .expect(400)
            })
        })
    })
    describe(`DELETE /api/items`, () => {
        context(`Given no Items`, () => {
            it(`responds with 404 and an error`, () => {
                const itemConfirmation = 777
                return supertest(app)
                    .delete(`/api/items/${itemConfirmation}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(404)
            })
        })
        context('Given items', () => {
            const testItems = makeItemsArray()
            beforeEach(`Insert items`, ()=>{
                return db
                    .into('items')
                    .insert(testItems)
            })
            const itemConfirmation = 2
            const expectdItems = testItems.filter(item => item.confirmation !== itemConfirmation)

            return supertest(app)
                .delete(`/api/items/${itemConfirmation}`)
                .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                .expect(204)
                .then(res => 
                    supertest(app)
                        .get('/api/items')
                        .set(`Authorization` `Bearer ${process.env.API_TOKEN}`)
                        .expect(expectdItems)
                    )
        })
    })
})
