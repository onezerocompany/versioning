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

const options = {
  track: process.env.TRACK ?? settings().defaults.track,
  build: Number(process.env.BUILD ?? 1),
  create: process.env.CREATE === 'true',
  template:
    process.env.VERSION_TEMPLATE ?? '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>',
};

info('\nrunning with options:');
const minChars = 14;

info(`${'  track:'.padEnd(minChars)} ${options.track}`);
info(`${'  build:'.padEnd(minChars)} ${options.build}`);
/* istanbul ignore next */
info(`${'  create:'.padEnd(minChars)} ${options.create ? 'yes' : 'no'}`);
info(`${'  template:'.padEnd(minChars)} ${options.template}\n\n`);

// eslint-disable-next-line no-void
void run(options.track, options.build, options.create, options.template);
