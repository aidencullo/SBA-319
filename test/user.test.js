import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js';

describe('GET /', () => {
  it('should return 200 OK with Hello World message', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Hello World!');
        done();
      });
  });
});
