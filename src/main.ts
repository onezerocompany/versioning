#!/usr/bin/env node
import { setOutput, info } from '@actions/core';
import { reportRateLimits } from './ratelimits';
import type { Tag } from './tags';
import { latestTag } from './tags';
import { Version } from './version';
import { settings } from './settings';
import { commitsFrom } from './commits';
import { createRelease } from './create-release';
import { VersionNumber } from './version-number';
import { ArgumentParser } from 'argparse';

export const generateDefaultVersionNumber = (
  track: string,
  build: number,
  template: string
): VersionNumber =>
  VersionNumber.fromVersionString(
    settings().defaults.version,
    template
  ).switchTracks(track, build, template);

export const generateVersion = async (
  track: string,
  build: number,
  template: string,
  tag: Tag | null
): Promise<Version> => {
  if (tag && typeof tag.versionNumber !== 'undefined') {
    // Fetch list of commits
    const commits = await commitsFrom(track, tag.commit);

    // Generate version
    return new Version({
      version: tag.versionNumber.switchTracks(track, build, template),
      commits,
      foundTag: typeof tag !== 'undefined',
    });
  }

  return new Version({
    version: generateDefaultVersionNumber(track, build, template),
    commits: [],
    foundTag: typeof tag !== 'undefined',
  });
};

export const getTag = async (
  track: string,
  template: string
): Promise<Tag | null> => {
  const tag = await latestTag(track, template);

  if (tag?.versionNumber) {
    info(
      `found tag -> commit: ${tag.commit} version: ${tag.versionNumber.versionString}`
    );
  }

  return tag;
};

/**
 * Run the main program
 * @param {string} track track to walk
 * @param {number} build build iteration
 * @param {boolean} create whether to create a github release or not
 * @param {string} template template for version number generation
 */
export const run = async (
  track: string,
  build: number,
  create: boolean,
  template: string
): Promise<string> => {
  let currentTrack = track;

  if (track.length < 1) currentTrack = settings().defaults.track;
  info(`driving track: ${track}`);

  await reportRateLimits();

  // Get the latest tag and generate a version
  const tag = await getTag(currentTrack, template);
  const version = await generateVersion(currentTrack, build, template, tag);

  setOutput('version', version);

  // Create release
  if (create && version.triggers.release) {
    info(`creating new release: ${version.version.versionString}`);
    await createRelease(version);
  }

  await reportRateLimits();

  return JSON.stringify(version);
};

/* istanbul ignore next */
const readInputs = (): Record<string, string | null> => {
  const parser = new ArgumentParser({
    description: 'Versioning Tool',
    add_help: true,
  });

  parser.add_argument('--github-token', {
    help: 'token for interacting with the GitHub API',
  });
  parser.add_argument('--build-number', {
    help: 'build number for the release',
  });
  parser.add_argument('--version-template', {
    help: 'template for the version number',
  });
  parser.add_argument('--create', {
    help: 'create a new release',
  });
  parser.add_argument('--track', {
    help: 'release track to use',
  });

  return parser.parse_args() as Record<string, string | null>;
};

/* istanbul ignore next */
if (require.main === module) {
  const inputs = readInputs();

  // eslint-disable-next-line no-void
  void run(
    inputs.track ?? settings().defaults.track,
    Number(inputs.build_number ?? 1),
    inputs.create === 'true',
    inputs.version_template ?? '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>'
  );
}
