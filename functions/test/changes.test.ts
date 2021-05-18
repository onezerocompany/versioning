import { describe, it } from 'mocha'
import { expect } from 'chai'
import { categories } from '../src/change-categories'
import { VersionBump } from '../src/version-number';

describe('Change Categories', () => {
  for (const change of categories) {
    describe(change.title, () => {
      it('has a description with more than 10 characters', () => {
        expect(change.description).to.have.a.lengthOf.at.least(10)
      })
      it('has more than 2 keys', () => {
        expect(change.keys).to.be.an('array').and.have.a.lengthOf.at.least(2)
      })
      it('has a version bump assigned', () => {
        expect(change.version_bump).to.not.be.undefined
      })
      it('runs tests if it releases', () => {
        if (change.triggers_release) {
          expect(change.run_tests).to.be.true
        }
      })
      it('bumps version if it releases', () => {
        if (change.triggers_release) {
          expect(change.version_bump).to.be.oneOf([VersionBump.major, VersionBump.minor, VersionBump.patch])
        }
      })
      it('does not do a major version bump', () => {
        expect(change.version_bump).to.not.equal(VersionBump.major)
      })
    })
  }
})