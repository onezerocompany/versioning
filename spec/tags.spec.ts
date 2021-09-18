import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import { latestTag } from '../src/tags';
import nock from 'nock';
import { setupCommitMock, setupLatestsTagsMock } from './mocks/mocks';

const testTagWithNoDate = (): void => {
  it('tag with no date should use now date', async () => {
    setupLatestsTagsMock();
    setupCommitMock(true);
    expect((await latestTag('main'))?.date).to.be.a('date');
  });
};

describe('Tags', () => {
  beforeEach(() => {
    process.env.GITHUB_REPOSITORY = 'onezerocompany/test';
  });

  afterEach(() => {
    nock.cleanAll();
  });

  testTagWithNoDate();

  it('getting latest tags', async () => {
    setupLatestsTagsMock();
    setupCommitMock();
    expect((await latestTag('main'))?.tag.commit).to.equal(
      '2C967C52975A4E38AF8F599CEFCBDB58'
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
