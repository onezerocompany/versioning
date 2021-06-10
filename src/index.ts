import { setOutput, getInput, info, error }
  from '@actions/core';
import { context } from '@actions/github';
import { reportRateLimits } from './ratelimits';
import { latestTag } from './tags';
import { Version } from './version-item';
import { settings } from './settings';
import { commitsFrom } from './commits';
import { createRelease } from './create-release';

/**
 * run the main program
 * @param {string} track track to walk
 * @param {number} build build iteration
 * @param {boolean} create whether to create a github release or not
 */
export async function run(
  track: string,
  build: number,
  create: boolean
): Promise<string> {
  info(`available tracks: ${settings().tracks.join(', ')}`);

  // startup
  if (track.length < 1) track = settings().releaseTrack;
  info(`driving track: ${track}`);

  await reportRateLimits();

  // fetch last tag
  const tag = await latestTag(track);
  if (tag) {
    info(`found tag -> commit: ${tag.commit} version: ${
      tag.versionNumber.versionString.full
    }`);
  } else {
    error('failed to get previous release');
    throw Error('failed to get previous release');
  }

  // fetch list of commits
  const commits = await commitsFrom(track, tag.commit);

  // generate version
  const version = new Version({
    version: tag.versionNumber.versionString.full,
    build, track, commits,
  });
  setOutput('version', version);

  // create release
  if (create) await createRelease(version);

  // finish
  await reportRateLimits();
  return JSON.stringify(version);
}
/* istanbul ignore next */
run(
  getInput('track') || '',
  Number(context.runId || '1'),
  ['true', 'yes'].indexOf(getInput('create').toLowerCase()) > -1 || false
);
