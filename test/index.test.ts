import { run } from '../src/index';
import { expect } from 'chai';
import { setupCommitsMock } from './commits.test';
import { setupRateLimitMock } from './ratelimits.test';
import { setupLatestTagsMock } from './tags.test';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as nock from 'nock';
import { setupReleaseMock } from './release.test';

describe('Main Run', () => {
  beforeEach(() => {
    nock.cleanAll();
    setupCommitsMock();
    setupRateLimitMock();
    setupLatestTagsMock();
    setupReleaseMock();
  });
  after(() => {
    nock.cleanAll();
  });
  it('should have correct output for release track', async () => {
    const version = await run('main', 1, false);
    expect(version).to.equal(JSON.stringify(JSON.parse(
      readFileSync(
        resolve(__dirname, 'data', 'version-output.json')
      ).toString()
    )));
  });
  it('should have correct response for non existent track', async () => {
    expect(run('non_existent', 1, false)).to.throw;
  });
  it('should have correct creation flow', async () => {
    const version = await run('main', 1, true);
    expect(version).to.equal(JSON.stringify(JSON.parse(
      readFileSync(
        resolve(__dirname, 'data', 'version-output.json')
      ).toString()
    )));
  });
});
