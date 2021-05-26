import { setOutput, getInput } from '@actions/core';
import { VersionInput, Version } from './version-item';
import { VersionTrack } from './version-number';

const input : VersionInput = {
  version: getInput('version', { required: true }),
  commits: JSON.parse(getInput('commits', { required: true })),
  track: getInput('track', { required: true }) as VersionTrack,
  build: Number(getInput('build', { required: true })),
};

setOutput('version', JSON.stringify(new Version(input)));
