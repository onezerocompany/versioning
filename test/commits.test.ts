import { expect } from 'chai';
import { readFileSync } from 'fs';
import * as nock from 'nock';
import { resolve } from 'path';
import { commitsFrom } from '../src/commits';

/**
 * Setup Commits List Mock Response
 */
export function setupCommitsMock(): void {
  nock('https://api.github.com')
    .persist()
    .get('/repos/appcompany/test/commits?per_page=100&sha=release')
    .reply(200, JSON.parse(readFileSync(
      resolve(__dirname, 'data', 'list-commits.json')).toString()
    ));
}

describe('Commits List', () => {
  before(() => {
    process.env.GITHUB_REPOSITORY = 'appcompany/test';
  });

  after(() => {
    nock.cleanAll();
  });

  it('should fetch correctly', async () => {
    setupCommitsMock();
    const commits = await commitsFrom(
      'release', '01F71A53VQAPJ11M1YV7CA4M48'
    );
    expect(commits).to.have.length(2);
    expect(commits[0].ref).to.equal('01F73JR3N31A5YAP89A8NVMTWG');
    expect(commits[0].message)
      .to.equal('Added a feature\n[feat]> added a feature');
    expect(commits[1].ref).to.equal('6dcb09b5b57875f334f61aebed695e2e4193db5e');
    expect(commits[1].message)
      .to.equal('Fixed some bugs\n[fix]> fixed a nasty bug');
  });
});
