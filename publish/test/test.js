const app = require('../index');
const request = require('supertest')
const expect = require('chai').expect;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

describe('GET Publisher Homepage', () => {
    it('should return home page', (done) => {
      request(app)
        .get('/')
        .end((err, res) => {
            expect(res.status).to.be.equal(200)
            done();
        });
    })
})

describe('POST a topic', () => {
    it('should publish topic', (done) => {
        request(app)
            .post('/publish/:topic')
            .send({ msg: 'hello' })
            .end((err, res) => {
                expect(res.status).to.be.equal(200);
                done();
            })
    })
})