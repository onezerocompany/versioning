import { expect } from 'chai';
import { describe, it } from 'mocha';
import { VersionNumber } from '../../src/version-number';

describe('Version Number - Track Switching', () => {
  it('should switch correctly', () => {
    let version = new VersionNumber({
      major: 1,
      minor: 0,
      patch: 0,
      track: 'release',
    });

    version = version.switchTracks('alpha');
    expect(version.track).to.equal('alpha');
    expect(version.versionString).to.equal('1.0.0-alpha/#1');
  });
  it('should set build and template correctly', () => {
    let version = new VersionNumber({
      major: 1,
      minor: 0,
      patch: 0,
      track: 'release',
    });
    const build = 24;

    version = version.switchTracks('alpha', build, 'v<<VERSION_STRING>>');
    expect(version.track).to.equal('alpha');
    expect(version.versionString).to.equal('v1.0.0');
  });
});
