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
    const commits = await commitsFrom('main', '01F71A53VQAPJ11M1YV7CA4M48');
    const expectedAmountOfCommits = 1;

    expect(commits).to.have.length(expectedAmountOfCommits);
    expect(commits[0].ref).to.equal('6dcb09b5b57875f334f61aebed695e2e4193db5e');
    expect(commits[0].message).to.equal(
      'This is the title.\nfeat(new) -> added a feature'
    );
  });
});
