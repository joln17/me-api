/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

require('../auth/auth_integration');

chai.should();

chai.use(chaiHttp);

const admin = {
    email: "admin@admin",
    password: "password"
};

const regularUser = {
    email: "user@user",
    password: "user1234"
};

let testReport = {
    id: 1,
    title: 'Title123',
    text: 'Text123',
};

let updatedReport = {
    id: 1,
    title: 'UpdatedTitle',
    text: 'UpdatedText',
};

let tokenAdmin = '';
let tokenRegularUser = '';


describe('Reports - Login', () => {
    describe('POST /auth/login', () => {
        it('should get 200, admin user logged in', (done) => {
            chai.request(server)
                .post('/auth/login')
                .send(admin)
                .end((err, res) => {
                    tokenRegularUser = res.body.data.token;
                    done();
                });
        });
    });

    describe('POST /auth/login', () => {
        it('should get 200, regular user logged in', (done) => {
            chai.request(server)
                .post('/auth/login')
                .send(regularUser)
                .end((err, res) => {
                    tokenAdmin = res.body.data.token;
                    done();
                });
        });
    });
});


describe('Reports', () => {
    describe('POST /reports', () => {
        it('should get 500, failed authentication', (done) => {
            chai.request(server)
                .post('/reports')
                .send(testReport)
                .set('x-access-token', 'wrong token')
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
    });

    describe('POST /reports', () => {
        it('should get 401, permission denied', (done) => {
            chai.request(server)
                .post('/reports')
                .send(testReport)
                .set('x-access-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe('POST /reports', () => {
        it('should get 401, no token provided', (done) => {
            chai.request(server)
                .post('/reports')
                .send(testReport)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe('POST /reports', () => {
        it('should get 201, report created', (done) => {
            chai.request(server)
                .post('/reports')
                .send(testReport)
                .set('x-access-token', tokenRegularUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
    });

    describe('GET /reports/titles', () => {
        it('should get 200, titles returned', (done) => {
            chai.request(server)
                .get('/reports/titles')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.equal(1);
                    res.body.data[0].id.should.equal(1);
                    res.body.data[0].title.should.equal('Title123');
                    done();
                });
        });
    });

    describe('GET /reports/week/1', () => {
        it('should get 200, report returned', (done) => {
            chai.request(server)
                .get('/reports/week/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('object');
                    res.body.data.id.should.equal(1);
                    res.body.data.title.should.equal('Title123');
                    res.body.data.text.should.equal('Text123');
                    done();
                });
        });
    });

    describe('PUT /reports', () => {
        it('should get 500, failed authentication', (done) => {
            chai.request(server)
                .put('/reports')
                .send(updatedReport)
                .set('x-access-token', 'wrong token')
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
    });

    describe('PUT /reports', () => {
        it('should get 401, permission denied', (done) => {
            chai.request(server)
                .put('/reports')
                .send(updatedReport)
                .set('x-access-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe('PUT /reports', () => {
        it('should get 401, no token provided', (done) => {
            chai.request(server)
                .put('/reports')
                .send(updatedReport)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe('PUT /reports', () => {
        it('should get 200, report updated', (done) => {
            chai.request(server)
                .put('/reports')
                .send(updatedReport)
                .set('x-access-token', tokenRegularUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('GET /reports/week/1', () => {
        it('should get 200, report returned', (done) => {
            chai.request(server)
                .get('/reports/week/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('object');
                    res.body.data.id.should.equal(1);
                    res.body.data.title.should.equal('UpdatedTitle');
                    res.body.data.text.should.equal('UpdatedText');
                    done();
                });
        });
    });

    describe('DELETE /reports', () => {
        it('should get 500, failed authentication', (done) => {
            chai.request(server)
                .delete('/reports/week/1')
                .set('x-access-token', 'wrong token')
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
    });

    describe('DELETE /reports', () => {
        it('should get 401, permission denied', (done) => {
            chai.request(server)
                .delete('/reports/week/1')
                .set('x-access-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe('DELETE /reports', () => {
        it('should get 401, no token provided', (done) => {
            chai.request(server)
                .delete('/reports/week/1')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe('DELETE /reports', () => {
        it('should get 204, report deleted', (done) => {
            chai.request(server)
                .delete('/reports/week/1')
                .set('x-access-token', tokenRegularUser)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
    });

    describe('GET /reports/week/1', () => {
        it('should get 200, empty data', (done) => {
            chai.request(server)
                .get('/reports/week/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    (res.body.data === undefined).should.be.true;
                    done();
                });
        });
    });
});
