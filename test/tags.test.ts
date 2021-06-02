import { latestTag } from '../src/tags';
import { expect } from 'chai';
import * as nock from 'nock';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Setup Tags Mock Response
 */
export function setupLatestTagsMock(): void {
  nock('https://api.github.com')
    .persist()
    .get('/repos/appcompany/test/tags?page=1')
    .reply(200, JSON.parse(
      readFileSync(
        resolve('test', 'data', 'latest-tags-page1.json')
      ).toString())
    );
  nock('https://api.github.com')
    .persist()
    .get('/repos/appcompany/test/tags?page=2')
    .reply(200, JSON.parse(
      readFileSync(
        resolve('test', 'data', 'latest-tags-page2.json')
      ).toString())
    );
  nock('https://api.github.com')
    .persist()
    .get('/repos/appcompany/test/tags?page=3')
    .reply(200, []);
}

describe('Tags', () => {
  before(() => {
    process.env.GITHUB_REPOSITORY = 'appcompany/test';
  });

  after(() => {
    nock.cleanAll();
  });

  it('getting latest tags', async () => {
    setupLatestTagsMock();
    expect((await latestTag('release')).commit)
      .to.equal('01F70VNMB8F0TFKQJ0X1A56DK4');
  });

  it('when no releases returns undefined', async () => {
    nock.cleanAll();
    nock('https://api.github.com')
      .get('/repos/appcompany/test/tags?page=1')
      .reply(200, []);
    expect((await latestTag('release')))
      .to.be.undefined;
  });
});
