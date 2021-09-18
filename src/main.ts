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

interface GenerateVersionOptions {
  track: string;
  build: number;
  template: string;
  tag?: Tag;
  date: Date;
}

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
  inputs: GenerateVersionOptions
): Promise<Version> => {
  if (!inputs.tag?.versionNumber) throw Error('No tag provided');

  // Fetch list of commits
  const commits = await commitsFrom(inputs.track, inputs.date);

  // Generate version
  return new Version({
    version: inputs.tag.versionNumber.switchTracks(
      inputs.track,
      inputs.build,
      inputs.template
    ),
    commits,
    foundTag: true,
  });
};

const jsonSpacing = 2;

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
  const tag = await latestTag(track, template);

  if (!tag) throw Error('No tag found');

  const version = await generateVersion({
    track: currentTrack,
    build,
    template,
    ...tag,
  });

  info(`\ngenerated version:\n${JSON.stringify(version, null, jsonSpacing)}\n`);
  setOutput('version', version);

  if (create && version.triggers.release) await createRelease(version);
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
