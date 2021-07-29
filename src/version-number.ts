import { CategoryBump } from './categories/categories';
import { settings } from './settings';

export interface VersionNumberParameters {
  major: number;
  minor: number;
  patch: number;
  track?: string;
  build?: number;
  template?: string;
}

/**
 * Reflects a version number and provides methods to alter it
 */
export class VersionNumber {
  public major: number;
  public minor: number;
  public patch: number;
  public track: string;
  public build: number;
  public template: string;
  public versionString: string;

  /**
   * Creates a {VersionNumber} from individual version number components
   * @param {number} major major section of the version number
   * @param {number} minor minor section of the version number
   * @param {number} patch patch section of the version number
   * @param {VersionTrack} track type of version
   * @param {number} build how many times this version has been build
   */
  public constructor(params: VersionNumberParameters) {
    this.major = params.major;
    this.minor = params.minor;
    this.patch = params.patch;
    this.track = params.track ?? settings().defaults.track;
    this.build = params.build ?? 1;
    this.template =
      params.template ?? '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>';
    this.versionString = this.template
      .replace(
        '<<VERSION_STRING>>',
        `${params.major}.${params.minor}.${params.patch}`
      )
      .replace('<<TRACK>>', this.track.toString())
      .replace('<<BUILD>>', this.build.toString());
  }

  // Version digit from string
  public static digitFromString(component: string, fallback: number): number {
    return parseInt(
      (component.length > 0 ? component : fallback.toString()).replace(
        /[^0-9]/u,
        ''
      ),
      10
    );
  }

  public static convertTemplateToRegex(template: string): RegExp {
    return new RegExp(
      template
        .replace(/<<VERSION_STRING>>/gu, '(?<version>\\d+.\\d+.\\d+)')
        .replace(/<<TRACK>>/gu, '(?<track>\\w+)')
        .replace(/<<BUILD>>/gu, '(?<build>\\d+)'),
      'u'
    );
  }

  /**
   * Converts a version string to a VersionNumber object
   * @param {string} versionString version string to convert
   * @param {string} track set the track for this version
   * @param {number} build set the build for this version
   * @return {VersionNumber}
   */
  public static fromVersionString(
    versionString: string | null = null,
    template = '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>'
  ): VersionNumber {
    const components: Record<string, string | undefined> =
      VersionNumber.convertTemplateToRegex(template).exec(versionString ?? '')
        ?.groups ?? {};
    const [major, minor, patch] = components.version?.split('.') ?? [
      '',
      '',
      '',
    ];

    return new VersionNumber({
      major: VersionNumber.digitFromString(major, 1),
      minor: VersionNumber.digitFromString(minor, 0),
      patch: VersionNumber.digitFromString(patch, 0),
      track: components.track ?? settings().defaults.track,
      build: VersionNumber.digitFromString(components.build ?? '', 1),
      template,
    });
  }

  /**
   * Bumps a version by a specified amount
   * @param {VersionBump} bump amount to bump the version by
   * @return {VersionNumber} bumped version
   */
  public bumped(bump: CategoryBump): VersionNumber {
    const isMajor = bump === CategoryBump.major;
    const isMinor = bump === CategoryBump.minor;
    const isPatch = bump === CategoryBump.patch;
    const minorBumped = isMinor ? this.minor + 1 : this.minor;
    const patchBumped = isPatch ? this.patch + 1 : this.patch;

    return new VersionNumber({
      major: isMajor ? this.major + 1 : this.major,
      minor: isMajor ? 0 : minorBumped,
      patch: isMajor || isMinor ? 0 : patchBumped,
      track: this.track,
      build: this.build,
      template: this.template,
    });
  }

  public switchTracks(
    track: string,
    build: number | null = null,
    template = '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>'
  ): VersionNumber {
    return new VersionNumber({
      major: this.major,
      minor: this.minor,
      patch: this.patch,
      build: build ?? this.build,
      track,
      template,
    });
  }
}
