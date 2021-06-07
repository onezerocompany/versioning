import { createRelease } from '../src/create-release';
import { Version } from '../src/version-item';
import * as chai from 'chai';
import * as nock from 'nock';
import * as chaiNock from 'chai-nock';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { setupCommitsMock } from './commits.test';
import { setupRateLimitMock } from './ratelimits.test';
import { setupLatestTagsMock } from './tags.test';

chai.use(chaiNock);

describe('Create Release', () => {
  before(() => {
    nock.cleanAll();
    setupCommitsMock();
    setupRateLimitMock();
    setupLatestTagsMock();
    process.env.GITHUB_REPOSITORY = 'appcompany/test';
  });
  after(() => {
    nock.cleanAll();
  });
  it('should create release', async () => {
    const version = new Version({
      version: '1.0.0',
      track: 'live',
      build: 1,
      commits: [{
        message: '[feat]> new feature\n[fix]> a fix\n[doc]> added a doc',
        ref: 'commit-ref',
      }],
    });
    const create = nock('https://api.github.com')
      .persist()
      .post('/repos/appcompany/test/releases')
      .reply(201, JSON.parse(readFileSync(
        resolve(__dirname, 'data', 'create-release-response.json')
      ).toString()));
    const upload = nock('https://api.github.com')
      .persist()
      .post('/repos/appcompany/test/releases/52347890/assets')
      .reply(201, JSON.parse(readFileSync(
        resolve(__dirname, 'data', 'release-upload-response.json')
      ).toString()));
    await createRelease(version);
    expect(create).to.have.been.requested;
    expect(upload).to.have.been.requested;
  });
});
