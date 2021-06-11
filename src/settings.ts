import { existsSync, readFileSync } from 'fs';
import { parse } from 'yaml';

/**
 * Settings for Versioning
 */
export class Settings {

  releaseTrack: string
  tracks: string[]
  majorVersion: number
  changelogs: {
    external: {
      enabled: boolean
      empty: string
    }
    internal: {
      enabled: boolean
      empty: string
    }
  }

  /**
   * Creates a Settings object
   */
  constructor() {
    this.releaseTrack = 'main';
    this.tracks = ['main', 'beta', 'alpha'];
    this.changelogs = {
      external: {
        enabled: true,
        empty: 'Bug Fixes:\n- minor bug fixes',
      },
      internal: {
        enabled: true,
        empty: 'Bug Fixes:\n- minor bug fixes',
      },
    };
  }

}

/**
 * Reads Settings fr`om Repository
 * @return {Settings}
 */
export function settings(): Settings {
  let settings : Settings = new Settings();
  if (existsSync('./versioning.yml')) {
    settings = parse(readFileSync('./versioning.yml').toString());
  }
  if (existsSync('./versioning.yaml')) {
    settings = parse(readFileSync('./versioning.yaml').toString());
  }
  return settings;
}
