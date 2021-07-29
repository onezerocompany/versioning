import { describe, it } from 'mocha';
import { expect } from 'chai';
import { VersionNumber } from '../../src/version-number';

describe('Version Number - Track Translations', () => {
  it('should translate main -> beta', () => {
    const version = VersionNumber.fromVersionString('1.0.0')?.switchTracks(
      'beta',
      1
    );

    expect(version?.versionString).to.equal('1.0.0-beta/#1');
  });
  it('should translate beta -> main', () => {
    const version =
      VersionNumber.fromVersionString('1.0.0-beta/#31')?.switchTracks('main');

    expect(version?.versionString).to.equal('1.0.0-main/#31');
  });
  it('should translate main -> alpha', () => {
    const version =
      VersionNumber.fromVersionString('2.5.1-main/#1')?.switchTracks('alpha');

    expect(version?.versionString).to.equal('2.5.1-alpha/#1');
  });
  it('should translate alpha -> main', () => {
    const version = VersionNumber.fromVersionString(
      '2.5.1-alpha/#41'
    )?.switchTracks('main', 1);

    expect(version?.versionString).to.equal('2.5.1-main/#1');
  });
});
