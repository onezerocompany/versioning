import { createRelease } from '../src/create-release';
import { Version } from '../src/version-item';
import * as nock from 'nock';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { setupCommitsMock } from './commits.test';
import { setupRateLimitMock } from './ratelimits.test';
import { setupLatestTagsMock } from './tags.test';

/**
 * Setup mock requests for release creation testing
 * @return {{ create: nock.Scope, upload: nock.Scope }}
 */
export function setupReleaseMock(): { create: nock.Scope, upload: nock.Scope } {
  const create = nock('https://api.github.com')
    .persist()
    .post('/repos/appcompany/test/releases')
    .reply(201, JSON.parse(readFileSync(
      resolve(__dirname, 'data', 'create-release-response.json')
    ).toString()));
  const upload = nock('https://uploads.github.com')
    .persist()
    .post(
      '/repos/appcompany/test/releases/52347890/assets'
    )
    .query({ name: 'version.json' })
    .reply(201, JSON.parse(readFileSync(
      resolve(__dirname, 'data', 'release-upload-response.json')
    ).toString()));
  return { create, upload };
}

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
    const requests = setupReleaseMock();
    const version = new Version({
      version: '1.0.0',
      track: 'live',
      build: 1,
      commits: [{
        message: '[feat]> new feature\n[fix]> a fix\n[doc]> added a doc',
        ref: 'commit-ref',
      }],
    });
    await createRelease(version);
    expect(requests.create.isDone()).to.equal(true);
    expect(requests.upload.isDone()).to.equal(true);
  }).timeout(10000);
});
