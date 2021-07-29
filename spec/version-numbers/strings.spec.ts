/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { VersionNumber } from '../../src/version-number';

const vInString = (): void => {
  it('should work with v in string', () => {
    const version = VersionNumber.fromVersionString('v3.1.6-alpha/#87');

    expect(version.major).to.equal(3);
    expect(version.minor).to.equal(1);
    expect(version.patch).to.equal(6);
    expect(version.track).to.equal('alpha');
    expect(version.build).to.equal(87);
  });
};

const noTrackAndBuild = (): void => {
  it('should work with no track and build', () => {
    const version = VersionNumber.fromVersionString(
      '3.1.6',
      '<<VERSION_STRING>>'
    );

    expect(version.major).to.equal(3);
    expect(version.minor).to.equal(1);
    expect(version.patch).to.equal(6);
    expect(version.track).to.equal('release');
    expect(version.build).to.equal(1);
  });
};

const empty = (): void => {
  it('should still work with empty string', () => {
    const version = VersionNumber.fromVersionString('');

    expect(version.major).to.equal(1);
    expect(version.minor).to.equal(0);
    expect(version.patch).to.equal(0);
    expect(version.track).to.equal('release');
    expect(version.build).to.equal(1);
  });
};

const onlyDots = (): void => {
  it('should still work only dots', () => {
    const version = VersionNumber.fromVersionString('..');

    expect(version.major).to.equal(1);
    expect(version.minor).to.equal(0);
    expect(version.patch).to.equal(0);
    expect(version.track).to.equal('release');
    expect(version.build).to.equal(1);
  });
};

const noString = (): void => {
  it('should still work with no string', () => {
    const version = VersionNumber.fromVersionString();

    expect(version.major).to.equal(1);
    expect(version.minor).to.equal(0);
    expect(version.patch).to.equal(0);
    expect(version.track).to.equal('release');
    expect(version.build).to.equal(1);
  });
};

const trackNoBuild = (): void => {
  it('should work with track and no build', () => {
    const version = VersionNumber.fromVersionString(
      '3.1.6-track',
      '<<VERSION_STRING>>-<<TRACK>>'
    );

    expect(version.major).to.equal(3);
    expect(version.minor).to.equal(1);
    expect(version.patch).to.equal(6);
  });
};

const mainTrackAndBuild = (): void => {
  it('should work with main track and build', () => {
    const version = VersionNumber.fromVersionString('3.1.6-release/#647');

    expect(version.track).to.equal('release');
    expect(version.major).to.equal(3);
    expect(version.minor).to.equal(1);
    expect(version.patch).to.equal(6);
    expect(version.build).to.equal(647);
  });
};

const betaTrackAndBuild = (): void => {
  it('should work with beta track and build', () => {
    const version = VersionNumber.fromVersionString('3.1.6-beta/#182');

    expect(version.track).to.equal('beta');
    expect(version.major).to.equal(3);
    expect(version.minor).to.equal(1);
    expect(version.patch).to.equal(6);
    expect(version.build).to.equal(182);
  });
};

const alphaTrackAndBuild = (): void => {
  it('should work with alpha track and build', () => {
    const version = VersionNumber.fromVersionString('3.1.6-alpha/#817');

    expect(version.track).to.equal('alpha');
    expect(version.major).to.equal(3);
    expect(version.minor).to.equal(1);
    expect(version.patch).to.equal(6);
    expect(version.build).to.equal(817);
  });
};

describe('Version Number - Generation from Strings', () => {
  vInString();
  noTrackAndBuild();
  empty();
  onlyDots();
  noString();
  trackNoBuild();
  mainTrackAndBuild();
  betaTrackAndBuild();
  alphaTrackAndBuild();
});
