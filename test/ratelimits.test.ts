import { reportRateLimits } from '../src/ratelimits';
import * as nock from 'nock';
import { expect } from 'chai';

/**
 * Setup Rate Limit Mock Responses
 */
export function setupRateLimitMock(): void {
  nock('https://api.github.com')
    .persist()
    .get('/rate_limit')
    .reply(201, {
      'rate': {
        'limit': 5000,
        'remaining': 4998,
        'reset': 1372700873,
      },
    });
}

describe('Rate Limit Reporting', () => {
  before(() => {
    process.env.GITHUB_REPOSITORY = 'appcompany/test';
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
