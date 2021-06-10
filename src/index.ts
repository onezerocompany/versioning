import { setOutput, getInput, info }
  from '@actions/core';
import { context } from '@actions/github';
import { reportRateLimits } from './ratelimits';
import { latestTag } from './tags';
import { Version } from './version-item';
import { settings } from './settings';
import { commitsFrom } from './commits';
import { createRelease } from './create-release';
import { VersionNumber } from './version-number';

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
  }

  let version : Version;
  if (tag) {
    // fetch list of commits
    const commits = await commitsFrom(track, tag.commit);

    // generate version
    version = new Version({
      version: tag.versionNumber.versionString.full,
      build, track, commits, major: settings().majorVersion,
    });
  } else {
    version = new Version({
      version: new VersionNumber(
        settings().majorVersion, 0, 0, track, build
      ).versionString.full,
      build, track, commits: [], major: settings().majorVersion,
    });
  }

  setOutput('version', version);

  // create release
  if (create && version.triggers.release) {
    info(`creating new release: ${version.version.versionString.full}`);
    await createRelease(version);
  }

  // finish
  await reportRateLimits();
  return JSON.stringify(version);
}
/* istanbul ignore next */
run(
  getInput('track') || '',
  Number(context.runNumber || '1'),
  ['true', 'yes'].indexOf(getInput('create').toLowerCase()) > -1 || false
);
