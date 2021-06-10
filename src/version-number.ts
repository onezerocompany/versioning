import { settings } from './settings';

export enum VersionBump {
  patch = 'patch',
  minor = 'minor',
  major = 'major',
  none = 'none'
}

export const bumpOrder : VersionBump[] = [
  VersionBump.none, VersionBump.patch, VersionBump.minor, VersionBump.major,
];

/**
 * Reflects a version number and provides methods to alter it
 */
export class VersionNumber {

  major: number
  minor: number
  patch: number
  track: string
  iteration: number

  versionString : {
    full: string
    withoutBuild: string
    onlyNumber: string
  }

  /**
   * creates a {VersionNumber} from individual version number components
   * @param {number} major major section of the version number
   * @param {number} minor minor section of the version number
   * @param {number} patch patch section of the version number
   * @param {VersionTrack} track type of version
   * @param {number} iteration how many times this version has been build
   */
  constructor(
    major = 1, minor = 0, patch = 0,
    track = settings().releaseTrack, iteration = 1
  ) {
    this.major = major;
    this.minor = minor;
    this.patch = patch;
    this.track = track;
    this.iteration = iteration;

    const onlyNumber = `${this.major}.${this.minor}.${this.patch}`;
    this.versionString = {
      full: `${onlyNumber}-${track}/#${this.iteration}`,
      withoutBuild: `${onlyNumber}-${track}`,
      onlyNumber,
    };
  }

  /**
   * bumps a version by a specified amount
   * @param {VersionBump} bump amount to bump the version by
   * @return {VersionNumber} bumped version
   */
  public bumped(bump: VersionBump): VersionNumber {
    const isMajor = bump == VersionBump.major;
    const isMinor = bump == VersionBump.minor;
    return new VersionNumber(
      isMajor ? this.major + 1 : this.major,
      isMajor ? 0 : isMinor ? this.minor + 1 : this.minor,
      (isMajor || isMinor) ? 0 : this.patch + 1,
      this.track, this.iteration
    );
  }


  /**
   * converts a version string to a VersionNumber object
   * @param {string} versionString version string to convert
   * @param {string} track set the track for this version
   * @param {number} iteration set the build for this version
   * @return {VersionNumber}
   */
  static fromVersionString(
    versionString: string | undefined = undefined,
    track: string | undefined = undefined,
    iteration: number | undefined = undefined
  ): VersionNumber {
    const components = (versionString ?? '').split('.')
      .flatMap((component: string) => component.split('-')
        .flatMap((subComponent: string) => subComponent.split('/'))
      );
    return new VersionNumber(
      Number(components[0] != '' ?
        (components[0]).replace(/[^0-9]/, '') : '1'
      ),
      Number((components[1] != '' ?
        (components[1] || '0').replace(/[^0-9]/, '') : '0')
      ),
      Number((components[2] != '' ?
        (components[2] || '0').replace(/[^0-9]/, '') : '0')
      ),
      (track ?? components[3]) ?? settings().releaseTrack,
      iteration ?? Number((components[4] ?? '1').replace( /[^0-9]/, ''))
    );
  }


}
