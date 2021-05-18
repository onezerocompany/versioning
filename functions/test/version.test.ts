import { describe, it } from 'mocha'
import { expect } from 'chai'
import { VersionNumber, VersionBump } from '../src/version-number';
import { VersionTrack } from '../src/version-item';

describe('Version', () => {

  describe('default value', () => {
    const version = new VersionNumber()
    it('major, minor and patch are 1.0.0', () => {
      expect(version.major).to.equal(1)
      expect(version.minor).to.equal(0)
      expect(version.patch).to.equal(0)
    })
    it('should have correct release versionString', () => {
      expect(version.versionString(VersionTrack.release)).to.equal('1.0.0')
    })
    it('should have correct beta versionString', () => {
      expect(version.versionString(VersionTrack.beta)).to.equal('1.0.0-beta')
    })
    it('should have correct alpha versionString', () => {
      expect(version.versionString(VersionTrack.alpha)).to.equal('1.0.0-alpha')
    })
  })

  describe('bumping versions', () => {
    const version = new VersionNumber()
    it('major bump should behave correctly', () => {
      expect(version.bumped(VersionBump.major).versionString()).to.equal('2.0.0')
    })
    it('minor bump should behave correctly', () => {
      expect(version.bumped(VersionBump.minor).versionString()).to.equal('1.1.0')
    })
    it('patch bump should behave correctly', () => {
      expect(version.bumped(VersionBump.patch).versionString()).to.equal('1.0.1')
    })
    it('none bump should behave correctly', () => {
      expect(version.bumped(VersionBump.none).versionString()).to.equal('1.0.0')
    })
  })

})