import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import { VersionNumber } from '../../src/version-number';
import { CategoryBump } from '../../src/categories/categories';

const mainVersion = new VersionNumber({
  major: 1,
  minor: 1,
  patch: 1,
  track: 'main',
  build: 1,
});

describe('Version Number - Bumping on Main Track', () => {
  it('major bump', () => {
    const bumped = mainVersion.bumped(CategoryBump.major);

    expect(bumped.versionString).to.equal('2.0.0-main/#1');
  });

  it('minor bump', () => {
    const bumped = mainVersion.bumped(CategoryBump.minor);

    expect(bumped.versionString).to.equal('1.2.0-main/#1');
  });

  it('patch bump', () => {
    const bumped = mainVersion.bumped(CategoryBump.patch);

    expect(bumped.versionString).to.equal('1.1.2-main/#1');
  });

  it('none bump', () => {
    const bumped = mainVersion.bumped(CategoryBump.none);

    expect(bumped.versionString).to.equal('1.1.1-main/#1');
  });
});

const betaVersion = new VersionNumber({
  major: 2,
  minor: 4,
  patch: 1,
  track: 'beta',
  build: 123,
});

describe('Version Number - Bumping on Beta Track', () => {
  it('major bump', () => {
    const bumped = betaVersion.bumped(CategoryBump.major);

    expect(bumped.versionString).to.equal('3.0.0-beta/#123');
  });

  it('minor bump', () => {
    const bumped = betaVersion.bumped(CategoryBump.minor);

    expect(bumped.versionString).to.equal('2.5.0-beta/#123');
  });

  it('patch bump', () => {
    const bumped = betaVersion.bumped(CategoryBump.patch);

    expect(bumped.versionString).to.equal('2.4.2-beta/#123');
  });

  it('none bump', () => {
    const bumped = betaVersion.bumped(CategoryBump.none);

    expect(bumped.versionString).to.equal('2.4.1-beta/#123');
  });
});

const alphaVersion = new VersionNumber({
  major: 4,
  minor: 6,
  patch: 3,
  track: 'alpha',
  build: 421,
});

describe('Version Number - Bumping on Alpha Track', () => {
  it('major bump', () => {
    const bumped = alphaVersion.bumped(CategoryBump.major);

    expect(bumped.versionString).to.equal('5.0.0-alpha/#421');
  });

  it('minor bump', () => {
    const bumped = alphaVersion.bumped(CategoryBump.minor);

    expect(bumped.versionString).to.equal('4.7.0-alpha/#421');
  });

  it('patch bump', () => {
    const bumped = alphaVersion.bumped(CategoryBump.patch);

    expect(bumped.versionString).to.equal('4.6.4-alpha/#421');
  });

  it('none bump', () => {
    const bumped = alphaVersion.bumped(CategoryBump.none);

    expect(bumped.versionString).to.equal('4.6.3-alpha/#421');
  });
});
