import { stringify } from 'yaml';
import { expect } from 'chai';
import { writeFileSync } from 'fs';
import { settings } from '../src/settings';

export const defaultChangelogMessage =
  (path: string): (() => void) =>
  (): void => {
    writeFileSync(
      path,
      stringify({
        defaults: {
          version: '1.0.0',
        },
      })
    );
    expect(settings().defaults.changelog.message.public).to.equal(
      'Bug Fixes:\n- minor bug fixes'
    );
    expect(settings().defaults.changelog.message.private).to.equal(
      '- no changes'
    );
  };

export const defaultPrivateChangelogMessage =
  (path: string): (() => void) =>
  (): void => {
    writeFileSync(
      path,
      stringify({
        defaults: {
          version: '1.0.0',
          changelog: {
            message: {
              public: 'Bug Fixes:\n- minor bug fixes',
            },
          },
        },
      })
    );
    expect(settings().defaults.changelog.message.public).to.equal(
      'Bug Fixes:\n- minor bug fixes'
    );
  };

export const defaultPublicChangelogMessage =
  (path: string): (() => void) =>
  (): void => {
    writeFileSync(
      path,
      stringify({
        defaults: {
          version: '1.0.0',
          changelog: {
            message: {
              private: '- no changes',
            },
          },
        },
      })
    );
    expect(settings().defaults.changelog.message.public).to.equal(
      'Bug Fixes:\n- minor bug fixes'
    );
  };

export const hasDefaultVersion =
  (path: string): (() => void) =>
  (): void => {
    writeFileSync(
      path,
      stringify({
        defaults: {
          track: 'main',
          changelog: {
            message: {
              public: 'Bug Fixes:\n- minor bug fixes',
              private: '- no changes',
            },
          },
        },
      })
    );
    expect(settings().defaults.version).to.equal('1.0.0');
  };

export const hasDefaultTrack =
  (path: string): (() => void) =>
  (): void => {
    writeFileSync(
      path,
      stringify({
        defaults: {
          version: '1.0.0',
          changelog: {
            message: {
              public: 'Bug Fixes:\n- minor bug fixes',
              private: '- no changes',
            },
          },
        },
      })
    );
    expect(settings().defaults.track).to.equal('release');
  };
