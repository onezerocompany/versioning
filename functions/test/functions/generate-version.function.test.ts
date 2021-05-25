import { describe } from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

describe('generateVersion', () => {
  it('should succeed correctly', () => {
    return chai.request('http://localhost:8080')
      .post('/generate-version')
      .send({
        reference: 'h1kj2h4kj1h2',
        version: '1.0.0',
        track: 'live',
        commits: [{
          title: 'changed some changes and tested some features',
          message: '[change]> this is a change\n[feat]> this is a feature',
        }],
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.version.versionString.full).to.equal('1.1.0');
        expect(res.body.reference).to.equal('h1kj2h4kj1h2');
        expect(res.body.changelogs.external).to.equal(
          'New Features:\n- this is a feature\n\nChanges:\n- this is a change'
        );
      });
  });
  it('beta with live version should work', () => {
    return chai.request('http://localhost:8080')
      .post('/generate-version')
      .send({
        version: '2.0.3',
        reference: 'tysudj2hg1',
        track: 'alpha',
        build: 23,
        commits: [{
          title: 'made some fixes',
          message: '[fix]> this is a fix',
        }],
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.version.versionString.full).to.equal('2.0.4-alpha/#23');
      });
  });
});
