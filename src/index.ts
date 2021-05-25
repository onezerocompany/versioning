import { setOutput, getInput } from '@actions/core';
import { VersionInput, Version } from './version-item';
import { VersionTrack } from './version-number';

const input : VersionInput = {
  version: getInput('version'),
  commits: JSON.parse(getInput('commits')),
  track: getInput('track') as VersionTrack,
  build: Number(getInput('build')),
};

setOutput('version', JSON.stringify(new Version(input)));
