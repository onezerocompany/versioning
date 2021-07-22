import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import { reportRateLimits } from '../src/ratelimits';
import nock from 'nock';
import { setupRateLimitMock } from './mocks/mocks';

describe('Rate Limit Reporting', () => {
  before(() => {
    process.env.GITHUB_REPOSITORY = 'onezerocompany/test';
  });

  after(() => {
    nock.cleanAll();
  });

  it('should report correctly', async () => {
    setupRateLimitMock();
    expect(await reportRateLimits())
      .to.contain('Rate Limit Status: 4998/5000')
      .and.to.contain('17:47:53 UTC');
  });
});
