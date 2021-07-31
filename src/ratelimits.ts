import { info } from '@actions/core';
import { getOctokit } from '@actions/github';

const millisInSecond = 1000;

/**
 * Reports Rate Limits to GitHub Action Log
 */
export const reportRateLimits = async (): Promise<string> => {
  const github = getOctokit(process.env.GITHUB_TOKEN ?? 'test');
  const rateLimits = (await github.rest.rateLimit.get()).data.rate;
  const date = new Date(rateLimits.reset * millisInSecond);
  const output = `Rate Limit Status: ${rateLimits.remaining}/${
    rateLimits.limit
  } (resets: ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()} UTC)`;

  info(output);

  return output;
};
