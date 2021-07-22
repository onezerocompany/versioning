import { expect } from 'chai';
import { Version } from '../src/version';
import { describe, it } from 'mocha';
import { VersionNumber } from '../src/version-number';

const mainCreate = (): void => {
  it('main should work', () => {
    const expectedChanges = 3;
    const version = new Version({
      version: new VersionNumber({
        major: 1,
        minor: 0,
        patch: 0,
        track: 'main',
        build: 1,
      }),
      commits: [
        {
          message:
            'feat(new) -> new feature\nfeat(fix) -> a fix\ndoc(new) -> added a doc',
          ref: 'commit-ref',
        },
      ],
      foundTag: true,
    });

    expect(version.changes).to.be.of.length(expectedChanges);
    expect(version.version.versionString).to.equal('1.1.0-main/#1');
  });
};

const betaCreate = (): void => {
  it('beta should work', () => {
    const expectedChanges = 2;
    const version = new Version({
      version: new VersionNumber({
        major: 1,
        minor: 0,
        patch: 0,
        track: 'beta',
        build: 42,
      }),
      commits: [
        {
          message: 'feat-new -> new feature\nbug-fix -> a fix',
          ref: 'commit-ref',
        },
      ],
      foundTag: true,
    });

    expect(version.changes).to.be.of.length(expectedChanges);
    expect(version.version.versionString).to.equal('1.1.0-beta/#42');
  });
};

const alphaCreate = (): void => {
  it('alpha should work', () => {
    const expectedChanges = 2;
    const version = new Version({
      version: new VersionNumber({
        major: 1,
        minor: 0,
        patch: 0,
        track: 'alpha',
        build: 72,
      }),
      commits: [
        {
          message: 'feat(change) -> changed feature\nfeat(fix) -> a fix',
          ref: 'commit-ref',
        },
      ],
      foundTag: true,
    });

    expect(version.changes).to.be.of.length(expectedChanges);
    expect(version.version.versionString).to.equal('1.1.0-alpha/#72');
  });
};

const majorUpgrade = (): void => {
  it('major upgrade should work', () => {
    const expectedChanges = 3;
    const version = new Version({
      version: new VersionNumber({
        major: 1,
        minor: 0,
        patch: 0,
        track: 'main',
        build: 1,
      }),
      commits: [
        {
          message:
            'feat(new) -> new feature\nfeat(fix) -> a fix\ndoc(new) -> added a doc\nBREAKING.',
          ref: 'commit-ref',
        },
      ],
      foundTag: true,
    });

    expect(version.changes).to.be.of.length(expectedChanges);
    expect(version.version.versionString).to.equal('2.0.0-main/#1');
  });
};

describe('Version Item - Creation', () => {
  mainCreate();
  betaCreate();
  alphaCreate();
  majorUpgrade();
});
