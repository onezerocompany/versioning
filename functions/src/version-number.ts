import { VersionTrack } from './version-item';

export enum VersionBump {
  patch = 'patch',
  minor = 'minor',
  major = 'major',
  none = 'none'
}

export class VersionNumber {

  major: number
  minor: number
  patch: number

  constructor(
    major: number = 1,
    minor: number = 0,
    patch: number = 0
  ) {
    this.major = major
    this.minor = minor
    this.patch = patch
  }

  versionString(forTrack: VersionTrack = VersionTrack.release) {
    let trackTag = forTrack == VersionTrack.release ? '' : `-${forTrack}`
    return `${this.major}.${this.minor}.${this.patch}${trackTag}`
  }

  bumped(version: VersionBump) {
    switch(version) {
      case VersionBump.none:
        return new VersionNumber(this.major, this.minor, this.patch)
      case VersionBump.patch:
        return new VersionNumber(this.major, this.minor, this.patch + 1)
      case VersionBump.minor:
        return new VersionNumber(this.major, this.minor + 1, 0)
      case VersionBump.major:
        return new VersionNumber(this.major + 1, 0, 0)
    }
  }

}