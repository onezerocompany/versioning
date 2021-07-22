import { describe, it } from 'mocha';
import { expect } from 'chai';
import type { Settings } from '../../src/settings';
import { settings } from '../../src/settings';

const defaults = (): void => {
  it('should have a defaults object', () => {
    const settingsOutput = settings({} as unknown as Settings);

    expect(settingsOutput.defaults.version).to.equal('1.0.0');
    expect(settingsOutput.defaults.track).to.equal('release');
    expect(settingsOutput.defaults.changelog.message.public).to.equal(
      'Bug Fixes:\n- minor bug fixes'
    );
    expect(settingsOutput.defaults.changelog.message.private).to.equal(
      '- no changes'
    );
  });
};

const defaultTrack = (): void => {
  it('should have a default track', () => {
    const settingsOutput = settings({
      defaults: {
        version: '1.0.0',
        changelog: {
          message: {
            private: '- private',
            public: '- public',
          },
        },
      },
    } as unknown as Settings);

    expect(settingsOutput.defaults.track).to.equal('release');
  });
};

const defaultVersion = (): void => {
  it('should have a default version', () => {
    const settingsOutput = settings({
      defaults: {
        track: 'release',
        changelog: {
          message: {
            private: '- private',
            public: '- public',
          },
        },
      },
    } as unknown as Settings);

    expect(settingsOutput.defaults.version).to.equal('1.0.0');
  });
};

const changelogDefaults = (): void => {
  it('should have a changelog defaults', () => {
    const settingsOutput = settings({
      defaults: {
        version: '1.0.0',
        track: 'release',
      },
    } as unknown as Settings);

    expect(settingsOutput.defaults.changelog.message.public).to.equal(
      'Bug Fixes:\n- minor bug fixes'
    );
    expect(settingsOutput.defaults.changelog.message.private).to.equal(
      '- no changes'
    );
  });
};

const changelogMessageDefaults = (): void => {
  it('should have a changelog message defaults', () => {
    const settingsOutput = settings({
      defaults: {
        version: '1.0.0',
        track: 'release',
        changelog: {
          message: {},
        },
      },
    } as unknown as Settings);

    expect(settingsOutput.defaults.changelog.message.public).to.equal(
      'Bug Fixes:\n- minor bug fixes'
    );
    expect(settingsOutput.defaults.changelog.message.private).to.equal(
      '- no changes'
    );
  });
};

describe('Settings - Defaults', () => {
  defaults();
  defaultTrack();
  defaultVersion();
  changelogDefaults();
  changelogMessageDefaults();
});
