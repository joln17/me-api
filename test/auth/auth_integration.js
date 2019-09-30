/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

chai.should();

chai.use(chaiHttp);

const admin = {
    email: "admin@admin",
    password: "password",
    name: "",
    birthdate: ""
};

const regularUser = {
    email: "user@user",
    password: "user1234",
    name: "",
    birthdate: ""
};

const invalidPass = {
    email: "invalid@invalid",
    password: "user123",
    name: "",
    birthdate: ""
};

const wrongPass = {
    email: "user@user",
    password: "user12345",
    name: "",
    birthdate: ""
};

const accessCode = {
    adminPass: admin.password
};

const wrongAccessCode = {
    adminPass: "wrong"
};

let tokenAdmin = '';
let tokenRegularUser = '';


describe('Auth', () => {
    describe('POST /auth/register', () => {
        it('should get 201, user created', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send(admin)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('object');
                    res.body.data.token.should.be.a('string');
                    res.body.data.admin.should.equal(0);
                    tokenAdmin = res.body.data.token;
                    done();
                });
        });
    });

    describe('PUT /auth/verify-admin-access-code', () => {
        it('should get 401, invalid access code', (done) => {
            chai.request(server)
                .put('/auth/verify-admin-access-code')
                .send(wrongAccessCode)
                .set('x-access-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe('PUT /auth/verify-admin-access-code', () => {
        it('should get 200, set admin status', (done) => {
            chai.request(server)
                .put('/auth/verify-admin-access-code')
                .send(accessCode)
                .set('x-access-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('object');
                    res.body.data.token.should.be.a('string');
                    res.body.data.admin.should.equal(1);
                    tokenAdmin = res.body.data.token;
                    done();
                });
        });
    });

    describe('POST /auth/register', () => {
        it('should get 201, user created', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send(regularUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('object');
                    res.body.data.token.should.be.a('string');
                    res.body.data.admin.should.equal(0);
                    tokenRegularUser = res.body.data.token;
                    done();
                });
        });
    });

    describe('POST /auth/register', () => {
        it('should get 401, invalid user/pass', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send(invalidPass)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe('POST /auth/register', () => {
        it('should get 400, user already registred', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send(regularUser)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('POST /auth/login', () => {
        it('should get 200, admin user logged in', (done) => {
            chai.request(server)
                .post('/auth/login')
                .send(admin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('object');
                    res.body.data.token.should.be.a('string');
                    res.body.data.admin.should.equal(1);
                    done();
                });
        });
    });

    describe('POST /auth/login', () => {
        it('should get 401, invalid user', (done) => {
            chai.request(server)
                .post('/auth/login')
                .send(invalidPass)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe('POST /auth/login', () => {
        it('should get 401, invalid email', (done) => {
            chai.request(server)
                .post('/auth/login')
                .send(wrongPass)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe('GET /auth/verify-login', () => {
        it('should get 200, user logged in', (done) => {
            chai.request(server)
                .get('/auth/verify-login')
                .set('x-access-token', tokenRegularUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('GET /auth/verify-admin-login', () => {
        it('should get 200, admin user logged in', (done) => {
            chai.request(server)
                .get('/auth/verify-admin-login')
                .set('x-access-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});
