import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';

import nock from 'nock';
import { commitsFrom } from '../src/commits';
import { setupCommitsListMock } from './mocks/mocks';

describe('Commits List', () => {
  before(() => {
    process.env.GITHUB_REPOSITORY = 'onezerocompany/test';
    setupCommitsListMock();
  });

  after(() => {
    nock.cleanAll();
  });

  it('should fetch correctly', async () => {
    const commits = await commitsFrom(
      'main',
      '646972F1D97145C98501D61944137CE7'
    );
    const expectedAmountOfCommits = 2;

    expect(commits).to.have.length(expectedAmountOfCommits);
    expect(commits[0].ref).to.equal('E4A319A07AB140E89AE6F1EB6E6C0F90');
    expect(commits[0].message).to.equal(
      'Added a logout button.\nfeat(new) -> added a logout button'
    );
    expect(commits[1].ref).to.equal('8F2C95D248F540178A48333F3BACB153');
    expect(commits[1].message).to.equal(
      'Added a login button.\nfeat(new) -> added a new login button'
    );
  });
});
