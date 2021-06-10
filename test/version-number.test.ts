import { describe, it } from 'mocha';
import { expect } from 'chai';
import { VersionBump, VersionNumber } from '../src/version-number';

describe('Version Number', () => {
  describe('default value', () => {
    it('major, minor and patch are 1.0.0', () => {
      const version = new VersionNumber();
      expect(version.major).to.equal(1);
      expect(version.minor).to.equal(0);
      expect(version.patch).to.equal(0);
      expect(version.iteration).to.equal(1);
      expect(version.track).to.equal('live');
    });
    it('should have correct live versionString', () => {
      const version = new VersionNumber();
      expect(version.versionString.full).to.equal('1.0.0-live/#1');
      expect(version.versionString.withoutBuild).to.equal('1.0.0-live');
      expect(version.versionString.onlyNumber).to.equal('1.0.0');
    });
    it('should have correct explicit live versionString', () => {
      const version = new VersionNumber(1, 0, 0, 'live');
      expect(version.versionString.full).to.equal('1.0.0-live/#1');
      expect(version.versionString.withoutBuild).to.equal('1.0.0-live');
      expect(version.versionString.onlyNumber).to.equal('1.0.0');
    });
    it('should have correct beta versionString', () => {
      const version = new VersionNumber(1, 0, 0, 'beta', 123);
      expect(version.versionString.full).to.equal('1.0.0-beta/#123');
      expect(version.versionString.withoutBuild).to.equal('1.0.0-beta');
      expect(version.versionString.onlyNumber).to.equal('1.0.0');
    });
    it('should have correct alpha versionString', () => {
      const version = new VersionNumber(1, 0, 0, 'alpha', 123);
      expect(version.versionString.full).to.equal('1.0.0-alpha/#123');
      expect(version.versionString.withoutBuild).to.equal('1.0.0-alpha');
      expect(version.versionString.onlyNumber).to.equal('1.0.0');
    });
  });

  describe('version from version string', () => {
    it('should work with v in string', () => {
      const version = VersionNumber.fromVersionString('v3.1.6-alpha/#87');
      expect(version.major).to.equal(3);
      expect(version.minor).to.equal(1);
      expect(version.patch).to.equal(6);
      expect(version.track).to.equal('alpha');
      expect(version.iteration).to.equal(87);
    });

    it('should work with no track and build', () => {
      const version = VersionNumber.fromVersionString('3.1.6');
      expect(version.major).to.equal(3);
      expect(version.minor).to.equal(1);
      expect(version.patch).to.equal(6);
      expect(version.track).to.equal('live');
      expect(version.iteration).to.equal(1);
    });

    it('should still work with empty string', () => {
      const version = VersionNumber.fromVersionString('');
      expect(version.major).to.equal(1);
      expect(version.minor).to.equal(0);
      expect(version.patch).to.equal(0);
      expect(version.track).to.equal('live');
      expect(version.iteration).to.equal(1);
    });

    it('should still work only dots', () => {
      const version = VersionNumber.fromVersionString('..');
      expect(version.major).to.equal(1);
      expect(version.minor).to.equal(0);
      expect(version.patch).to.equal(0);
      expect(version.track).to.equal('live');
      expect(version.iteration).to.equal(1);
    });

    it('should still work with no string', () => {
      const version = VersionNumber.fromVersionString();
      expect(version.major).to.equal(1);
      expect(version.minor).to.equal(0);
      expect(version.patch).to.equal(0);
      expect(version.track).to.equal('live');
      expect(version.iteration).to.equal(1);
    });

    it('should work with track and no build', () => {
      const version = VersionNumber.fromVersionString('3.1.6-track');
      expect(version.major).to.equal(3);
      expect(version.minor).to.equal(1);
      expect(version.patch).to.equal(6);
    });

    it('should work with live track and build', () => {
      const version = VersionNumber.fromVersionString('3.1.6-live/#647');
      expect(version.track).to.equal('live');
      expect(version.major).to.equal(3);
      expect(version.minor).to.equal(1);
      expect(version.patch).to.equal(6);
      expect(version.iteration).to.equal(647);
    });

    it('should work with beta track and build', () => {
      const version = VersionNumber.fromVersionString('3.1.6-beta/#182');
      expect(version.track).to.equal('beta');
      expect(version.major).to.equal(3);
      expect(version.minor).to.equal(1);
      expect(version.patch).to.equal(6);
      expect(version.iteration).to.equal(182);
    });

    it('should work with alpha track and build', () => {
      const version = VersionNumber.fromVersionString('3.1.6-alpha/#817');
      expect(version.track).to.equal('alpha');
      expect(version.major).to.equal(3);
      expect(version.minor).to.equal(1);
      expect(version.patch).to.equal(6);
      expect(version.iteration).to.equal(817);
    });
  });

  describe('track translations', () => {
    it('should translate live -> beta', () => {
      const version = VersionNumber
        .fromVersionString('1.0.0', 'beta', 1);
      expect(version.versionString.full).to.equal('1.0.0-beta/#1');
    });
    it('should translate beta -> live', () => {
      const version = VersionNumber
        .fromVersionString('1.0.0-beta/#31', 'live', 1);
      expect(version.versionString.full).to.equal('1.0.0-live/#1');
    });
    it('should translate live -> alpha', () => {
      const version = VersionNumber
        .fromVersionString('2.5.1', 'alpha', 1);
      expect(version.versionString.full).to.equal('2.5.1-alpha/#1');
    });
    it('should translate alpha -> live', () => {
      const version = VersionNumber
        .fromVersionString('2.5.1-alpha/#41', 'live', 1);
      expect(version.versionString.full).to.equal('2.5.1-live/#1');
    });
  });

  describe('bumping versions', () => {
    describe('live track', () => {
      const version = new VersionNumber(1, 1, 1, 'live', 1);

      it('major bump', () => {
        const bumped = version.bumped(VersionBump.major);
        expect(bumped.versionString.full).to.equal('2.0.0-live/#1');
      });

      it('minor bump', () => {
        const bumped = version.bumped(VersionBump.minor);
        expect(bumped.versionString.full).to.equal('1.2.0-live/#1');
      });

      it('patch bump', () => {
        const bumped = version.bumped(VersionBump.patch);
        expect(bumped.versionString.full).to.equal('1.1.2-live/#1');
      });

      it('none bump', () => {
        const bumped = version.bumped(VersionBump.none);
        expect(bumped.versionString.full).to.equal('1.1.2-live/#1');
      });
    });

    describe('beta track', () => {
      const version = new VersionNumber(2, 4, 1, 'beta', 123);

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
        expect(bumped.versionString.full).to.equal('2.4.2-beta/#123');
      });
    });

    describe('alpha track', () => {
      const version = new VersionNumber(4, 6, 3, 'alpha', 421);

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
        expect(bumped.versionString.full).to.equal('4.6.4-alpha/#421');
      });
    });
  });
});
