import { expect } from 'chai';
import { Version } from '../src/version-item';
import { describe } from 'mocha';
import { VersionTrack } from '../src/version-number';

describe('Version Item', () => {
  describe('creation', () => {
    it('live should work', () => {
      const version = new Version({
        version: '1.0.0',
        track: VersionTrack.live,
        build: 1,
        commits: [{
          title: 'this is a title',
          message: '[feat]> new feature\n[fix]> a fix\n[doc]> added a doc',
          ref: 'commit-ref',
        }],
      });
      expect(version.version.versionString.full).to.equal('1.1.0');
    });

    it('beta should work', () => {
      const version = new Version({
        version: '1.0.0-beta/#42',
        track: VersionTrack.beta,
        build: 51,
        commits: [{
          title: 'this is a title',
          message: '[feat]> new feature\n[fix]> a fix',
          ref: 'commit-ref',
        }],
      });
      expect(version.version.versionString.full).to.equal('1.1.0-beta/#51');
    });

    it('alpha should work', () => {
      const version = new Version({
        version: '1.0.0-alpha/#22',
        track: VersionTrack.alpha,
        build: 72,
        commits: [{
          title: 'this is a title',
          message: '[change]> changed feature\n[fix]> a fix',
          ref: 'commit-ref',
        }],
      });
      expect(version.version.versionString.full).to.equal('1.1.0-alpha/#72');
    });
  });
});
