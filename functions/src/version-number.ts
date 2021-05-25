export enum VersionBump {
  patch = 'patch',
  minor = 'minor',
  major = 'major',
  none = 'none'
}

export const bumpOrder : VersionBump[] = [
  VersionBump.none, VersionBump.patch, VersionBump.minor, VersionBump.major,
];

export enum VersionTrack {
  live = 'live',
  beta = 'beta',
  alpha = 'alpha'
}

/**
 * Reflects a version number and provides methods to alter it
 */
export class VersionNumber {

  major: number
  minor: number
  patch: number
  track: VersionTrack
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
   * @param {string} iteration how many times this version has been build
   */
  constructor(
    major = 1, minor = 0, patch = 0,
    track = VersionTrack.live, iteration = 1
  ) {
    this.major = major;
    this.minor = minor;
    this.patch = patch;
    this.track = track;
    this.iteration = iteration;

    const onlyNumber = `${this.major}.${this.minor}.${this.patch}`;
    const trackLabel = this.track == VersionTrack.live ? '' : `-${this.track}`;
    const withoutBuild = `${onlyNumber}${trackLabel}`;
    this.versionString = {
      full: this.track == VersionTrack.live ?
        withoutBuild : `${withoutBuild}/#${this.iteration}`,
      withoutBuild, onlyNumber,
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
    const isPatch = bump == VersionBump.patch;

    return new VersionNumber(
      isMajor ? this.major + 1 : this.major,
      isMajor ? 0 : isMinor ? this.minor + 1 : this.minor,
      (isMajor || isMinor) ? 0 : isPatch ? this.patch + 1 : this.patch,
      this.track, this.iteration
    );
  }


  /**
   * converts a version string to a VersionNumber object
   * @param {string} versionString version string to convert
   * @param {VersionTrack} track set the track for this version
   * @param {number} build set the build for this version
   * @return {VersionNumber}
   */
  static fromVersionString(
    versionString: string,
    track: VersionTrack | undefined = undefined,
    build: number | undefined = undefined
  ): VersionNumber {
    const components = (versionString ?? '').split('.')
      .flatMap((component) => component ? (component ?? '').split('-')
        .flatMap((subComponent) =>
          subComponent ? (subComponent ?? '').split('/') : undefined
        ) : undefined
      );
    return new VersionNumber(
      Number(components[0]),
      Number(components[1]),
      Number(components[2]),
      track ?? components[3] as VersionTrack,
      build ?? Number((components[4] ?? '').replace( /[^0-9]/, ''))
    );
  }


}
