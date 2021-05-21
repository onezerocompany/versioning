import { expect } from 'chai';
import { Version } from '../src/version-item';

describe('Version Item', () => {
  describe('creation', () => {
    it('live should work', () => {
      const version = new Version({
        lastRef: 'last-ref',
        lastVersion: '1.0.0',
        commits: [{
          title: 'this is a title',
          message: '[feat]> new feature\n[fix]> a fix',
          ref: 'commit-ref',
        }],
      });
      expect(version.version.versionString.full).to.equal('1.1.0');
    });

    // it('beta should work', () => {

    //   const version = new Version(
    //     VersionTrack.live, '1.0.0', [
    //       {title: 'title', message: '[feat]> new feature', ref: 'last-ref'},
    //     ], 'last-ref');
    //   expect(version.version.versionString.full).to.equal('1.1.0-beta/#12');

    // });
  });
});
