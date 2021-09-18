import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';

import nock from 'nock';
import { commitsFrom } from '../src/commits';
import { setupCommitsListMock } from './mocks/mocks';

describe('Commits List', () => {
  beforeEach(() => {
    process.env.GITHUB_REPOSITORY = 'onezerocompany/test';
    setupCommitsListMock();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should fetch correctly', async () => {
    const commits = await commitsFrom('main', new Date('2020-02-16'));
    const expectedAmountOfCommits = 3;

    expect(commits).to.have.length(expectedAmountOfCommits);
    expect(commits[0].ref).to.equal('646972F1D97145C98501D61944137CE7');
    expect(commits[0].message).to.equal(
      'Fixed the authentication screen.\nfeat(fix) -> fixed the auth screen'
    );
    expect(commits[1].ref).to.equal('E4A319A07AB140E89AE6F1EB6E6C0F90');
    expect(commits[1].message).to.equal(
      'Added a logout button.\nfeat(new) -> added a logout button'
    );
    expect(commits[2].ref).to.equal('8F2C95D248F540178A48333F3BACB153');
    expect(commits[2].message).to.equal(
      'Added a login button.\nfeat(new) -> added a new login button'
    );
  });
});
