import { getInput, info } from '@actions/core';
import { getOctokit } from '@actions/github';

/**
 * Reports Rate Limits to GitHub Action Log
 */
export async function reportRateLimits(): Promise<string> {
  const github = getOctokit(getInput('token') || 'test');
  const rateLimits = (await github.rest.rateLimit.get()).data.rate;
  const date = new Date(rateLimits.reset * 1000);
  const output = `Rate Limit Status: ${
    rateLimits.remaining
  }/${
    rateLimits.limit
  } (resets: ${
    date.getUTCHours()
  }:${
    date.getUTCMinutes()
  }:${
    date.getUTCSeconds()
  } UTC)`;
  info(output);
  return output;
}
