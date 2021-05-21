import { describe, it } from 'mocha';
import { expect } from 'chai';
import { VersionBump, VersionNumber, VersionTrack }
  from '../src/version-number';

describe('Version Number', () => {

  describe('default value', () => {

    it('major, minor and patch are 1.0.0', () => {

      const version = new VersionNumber();
      expect(version.major).to.equal(1);
      expect(version.minor).to.equal(0);
      expect(version.patch).to.equal(0);
      expect(version.build).to.equal('1');
      expect(version.track).to.equal(VersionTrack.live);

    });
    it('should have correct release versionString', () => {

      const version = new VersionNumber();
      expect(version.versionString.full).to.equal('1.0.0');
      expect(version.versionString.withoutBuild).to.equal('1.0.0');
      expect(version.versionString.onlyNumber).to.equal('1.0.0');

    });
    it('should have correct beta versionString', () => {

      const version = new VersionNumber(1, 0, 0, VersionTrack.beta, '123');
      expect(version.versionString.full).to.equal('1.0.0-beta/#123');
      expect(version.versionString.withoutBuild).to.equal('1.0.0-beta');
      expect(version.versionString.onlyNumber).to.equal('1.0.0');

    });
    it('should have correct alpha versionString', () => {

      const version = new VersionNumber(1, 0, 0, VersionTrack.alpha, '123');
      expect(version.versionString.full).to.equal('1.0.0-alpha/#123');
      expect(version.versionString.withoutBuild).to.equal('1.0.0-alpha');
      expect(version.versionString.onlyNumber).to.equal('1.0.0');

    });

  });

  describe('version from version string', () => {

    it('should work with no track and build', () => {

      const version = VersionNumber.fromVersionString('3.1.6');
      expect(version.major).to.equal(3);
      expect(version.minor).to.equal(1);
      expect(version.patch).to.equal(6);

    });

    it('should work with track and no build', () => {

      const version = VersionNumber.fromVersionString('3.1.6-track');
      expect(version.major).to.equal(3);
      expect(version.minor).to.equal(1);
      expect(version.patch).to.equal(6);

    });

    it('should work with beta track and build', () => {

      const version = VersionNumber.fromVersionString('3.1.6-beta/#182');
      expect(version.major).to.equal(3);
      expect(version.minor).to.equal(1);
      expect(version.patch).to.equal(6);

    });

    it('should work with alpha track and build', () => {

      const version = VersionNumber.fromVersionString('3.1.6-alpha/#817');
      expect(version.major).to.equal(3);
      expect(version.minor).to.equal(1);
      expect(version.patch).to.equal(6);

    });

  });

  describe('bumping versions', () => {


    describe('live track', () => {

      const version = new VersionNumber(1, 1, 1, VersionTrack.live, '1');

      it('major bump', () => {

        const bumped = version.bumped(VersionBump.major);
        expect(bumped.versionString.full).to.equal('2.0.0');

      });

      it('minor bump', () => {

        const bumped = version.bumped(VersionBump.minor);
        expect(bumped.versionString.full).to.equal('1.2.0');

      });

      it('patch bump', () => {

        const bumped = version.bumped(VersionBump.patch);
        expect(bumped.versionString.full).to.equal('1.1.2');

      });

      it('none bump', () => {

        const bumped = version.bumped(VersionBump.none);
        expect(bumped.versionString.full).to.equal('1.1.1');

      });

    });

    describe('beta track', () => {

      const version = new VersionNumber(2, 4, 1, VersionTrack.beta, '123');

      it('major bump', () => {

        const bumped = version.bumped(VersionBump.major);
        expect(bumped.versionString.full).to.equal('3.0.0-beta/#123');

      });

      it('minor bump', () => {

        const bumped = version.bumped(VersionBump.minor);
        expect(bumped.versionString.full).to.equal('2.5.0-beta/#123');

      });

      it('patch bump', () => {

        const bumped = version.bumped(VersionBump.patch);
        expect(bumped.versionString.full).to.equal('2.4.2-beta/#123');

      });

      it('none bump', () => {

        const bumped = version.bumped(VersionBump.none);
        expect(bumped.versionString.full).to.equal('2.4.1-beta/#123');

      });

    });

    describe('alpha track', () => {

      const version = new VersionNumber(4, 6, 3, VersionTrack.alpha, '421');

      it('major bump', () => {

        const bumped = version.bumped(VersionBump.major);
        expect(bumped.versionString.full).to.equal('5.0.0-alpha/#421');

      });

      it('minor bump', () => {

        const bumped = version.bumped(VersionBump.minor);
        expect(bumped.versionString.full).to.equal('4.7.0-alpha/#421');

      });

      it('patch bump', () => {

        const bumped = version.bumped(VersionBump.patch);
        expect(bumped.versionString.full).to.equal('4.6.4-alpha/#421');

      });

      it('none bump', () => {

        const bumped = version.bumped(VersionBump.none);
        expect(bumped.versionString.full).to.equal('4.6.3-alpha/#421');

      });

    });

  });

});
