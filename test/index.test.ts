import { run } from '../src/index';
import { expect } from 'chai';
import { setupCommitsMock } from './commits.test';
import { setupRateLimitMock } from './ratelimits.test';
import { setupLatestTagsMock } from './tags.test';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as nock from 'nock';

describe('Main Run', () => {
  beforeEach(() => {
    nock.cleanAll();
    setupCommitsMock();
    setupRateLimitMock();
    setupLatestTagsMock();
  });
  it('should have correct output for release track', async () => {
    const version = await run('release', 1, false);
    expect(version).to.equal(JSON.stringify(JSON.parse(
      readFileSync(
        resolve(__dirname, 'data', 'version-output.json')
      ).toString()
    )));
  });
  it('should have correct response for non existent track', async () => {
    expect(run('non_existent', 1, false)).to.throw;
  });
});
