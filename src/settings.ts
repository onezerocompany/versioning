import { existsSync, readFileSync } from 'fs';
import { parse } from 'yaml';

/**
 * Settings for Versioning
 */
export class Settings {
  public defaults: {
    track: string;
    version: string;
    changelog: {
      message: {
        public: string;
        private: string;
      };
    };
  };

  /**
   * Creates a Settings object
   */
  public constructor() {
    this.defaults = {
      track: 'release',
      version: '1.0.0',
      changelog: {
        message: {
          public: 'Bug Fixes:\n- minor bug fixes',
          private: '- no changes',
        },
      },
    };
  }
}

const loadSettings = (): Settings => {
  if (existsSync('./versioning.yml')) {
    return parse(readFileSync('./versioning.yml').toString()) as Settings;
  }

  if (existsSync('./versioning.yaml')) {
    return parse(readFileSync('./versioning.yaml').toString()) as Settings;
  }

  return new Settings();
};

const ensureDefaultsExists = (inputSettings: Settings): void => {
  // Add default values to settings if they don't exist
  if (typeof inputSettings.defaults === 'undefined') {
    inputSettings.defaults = {
      track: 'release',
      version: '1.0.0',
      changelog: {
        message: {
          public: 'Bug Fixes:\n- minor bug fixes',
          private: '- no changes',
        },
      },
    };
  }
};

const ensureDefaultValues = (inputSettings: Settings): void => {
  // Ensure track default is a string and otherwise set it to release
  if (typeof inputSettings.defaults.track !== 'string') {
    inputSettings.defaults.track = 'release';
  }

  // Ensure version default is a string and otherwise set it to 1.0.0
  if (typeof inputSettings.defaults.version !== 'string') {
    inputSettings.defaults.version = '1.0.0';
  }
};

const ensureChangelogValues = (inputSettings: Settings): void => {
  if (
    typeof inputSettings.defaults.changelog === 'undefined' ||
    typeof inputSettings.defaults.changelog.message === 'undefined'
  ) {
    inputSettings.defaults.changelog = {
      message: {
        public: 'Bug Fixes:\n- minor bug fixes',
        private: '- no changes',
      },
    };
  } else {
    if (typeof inputSettings.defaults.changelog.message.public !== 'string')
      inputSettings.defaults.changelog.message.public =
        'Bug Fixes:\n- minor bug fixes';
    if (typeof inputSettings.defaults.changelog.message.private !== 'string')
      inputSettings.defaults.changelog.message.private = '- no changes';
  }
};

/**
 * Reads Settings from Repository
 * @return {Settings}
 */
export const settings = (settingsObject?: Settings): Settings => {
  const outputSettings: Settings = settingsObject ?? loadSettings();

  ensureDefaultsExists(outputSettings);
  ensureDefaultValues(outputSettings);
  ensureChangelogValues(outputSettings);

  return outputSettings;
};
