import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import { latestTag } from '../src/tags';
import nock from 'nock';
import { setupLatestsTagsMock } from './mocks/mocks';

describe('Tags', () => {
  before(() => {
    process.env.GITHUB_REPOSITORY = 'onezerocompany/test';
  });

  after(() => {
    nock.cleanAll();
  });

  it('getting latest tags', async () => {
    setupLatestsTagsMock();
    expect((await latestTag('main'))?.commit).to.equal(
      '01F70VNMB8F0TFKQJ0X1A56DK4'
    );
  });

  it('when no releases returns undefined', async () => {
    const status = 200;

    nock.cleanAll();
    nock('https://api.github.com')
      .get('/repos/onezerocompany/test/tags?page=1')
      .reply(status, []);
    expect(await latestTag('main')).to.be.null;
  });
});
