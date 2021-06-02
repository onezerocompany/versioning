import { settings } from '../src/settings';
import { readFileSync, rmSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { expect } from 'chai';

describe('Settings', () => {
  const filePath = resolve(__dirname, '..', 'versioning.yml');
  const original = readFileSync(filePath).toString();

  before(() => {
    rmSync(filePath);
  });

  after(() => {
    writeFileSync(filePath, original);
  });

  it('works with versioning.yml', () => {
    const path = resolve(__dirname, '..', 'versioning.yml');
    writeFileSync(path, original);
    expect(settings().releaseTrack).to.equal('release');
    rmSync(path);
  });

  it('works with versioning.yaml', () => {
    const path = resolve(__dirname, '..', 'versioning.yaml');
    writeFileSync(path, original);
    expect(settings().releaseTrack).to.equal('release');
    rmSync(path);
  });
});
