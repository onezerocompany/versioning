import { describe, it } from 'mocha';
import { expect } from 'chai';
import { VersionNumber } from '../../src/version-number';

const majorMinorPath = (): void => {
  const version = new VersionNumber({ major: 1, minor: 0, patch: 0 });

  expect(version.major).to.equal(1);
  expect(version.minor).to.equal(0);
  expect(version.patch).to.equal(0);
  expect(version.build).to.equal(1);
  expect(version.track).to.equal('release');
};

const mainVersionString = (): void => {
  const version = new VersionNumber({ major: 1, minor: 0, patch: 0 });

  expect(version.versionString).to.equal('1.0.0-release/#1');
};

const explicitVersionString = (): void => {
  const version = new VersionNumber({
    major: 1,
    minor: 0,
    patch: 0,
    track: 'explicit',
  });

  expect(version.versionString).to.equal('1.0.0-explicit/#1');
};

const betaVersionString = (): void => {
  const version = new VersionNumber({
    major: 1,
    minor: 0,
    patch: 0,
    track: 'beta',
    build: 123,
  });

  expect(version.versionString).to.equal('1.0.0-beta/#123');
};

const alphaVersionString = (): void => {
  const version = new VersionNumber({
    major: 1,
    minor: 0,
    patch: 0,
    track: 'alpha',
    build: 123,
  });

  expect(version.versionString).to.equal('1.0.0-alpha/#123');
};

describe('Version Number - Defaults', () => {
  it('major, minor and patch are 1.0.0', majorMinorPath);
  it('should have correct main versionString', mainVersionString);
  it('should have correct explicit main versionString', explicitVersionString);
  it('should have correct beta versionString', betaVersionString);
  it('should have correct alpha versionString', alphaVersionString);
});
