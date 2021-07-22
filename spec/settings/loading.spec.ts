import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';

import { Settings, settings as getSettings } from '../../src/settings';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { stringify } from 'yaml';

const shortPath = resolve(__dirname, '../../versioning.yml');
const longPath = resolve(__dirname, '../../versioning.yaml');
const original = existsSync(shortPath)
  ? readFileSync(shortPath).toString()
  : stringify(new Settings());

beforeEach(() => {
  if (existsSync(shortPath)) rmSync(shortPath);
  if (existsSync(longPath)) rmSync(longPath);
});
afterEach(() => {
  // Restore original settings.yml
  writeFileSync(shortPath, original);
  if (existsSync(longPath)) rmSync(longPath);
});

const shortExtensionLoads = (): void => {
  it('settings with short extension load', () => {
    const settings = new Settings();

    settings.defaults.version = '2.0.0';
    settings.defaults.track = 'short_track';
    writeFileSync(shortPath, stringify(settings));

    expect(getSettings().defaults.track).to.equal('short_track');
    expect(getSettings().defaults.version).to.equal('2.0.0');
  });
};

const longExtensionLoads = (): void => {
  it('settings with long extension load', () => {
    const settings = new Settings();

    settings.defaults.version = '7.0.0';
    settings.defaults.track = 'long_track';
    writeFileSync(longPath, stringify(settings));

    expect(getSettings().defaults.track).to.equal('long_track');
    expect(getSettings().defaults.version).to.equal('7.0.0');
  });
};

const noSettingsLoads = (): void => {
  it('settings with no settings load', () => {
    expect(getSettings().defaults.track).to.equal('release');
    expect(getSettings().defaults.version).to.equal('1.0.0');
  });
};

describe('Settings - Loading', () => {
  shortExtensionLoads();
  longExtensionLoads();
  noSettingsLoads();
});
