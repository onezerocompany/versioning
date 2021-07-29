import { describe, it, beforeEach, after } from 'mocha';
import {
  generateDefaultVersionNumber,
  generateVersion,
  run,
} from '../src/main';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as nock from 'nock';
import {
  setupCommitsListMock,
  setupLatestsTagsMock,
  setupRateLimitMock,
  setupReleaseCreateMock,
  setupReleaseUploadAssetMock,
} from './mocks/mocks';
import { CategoryBump } from '../src/categories/categories';
import { settings } from '../src/settings';

const setupMocks = (): void => {
  process.env.GITHUB_REPOSITORY = 'onezerocompany/test';
  process.env.GITHUB_TOKEN = 'test';
  nock.cleanAll();
  setupCommitsListMock();
  setupLatestsTagsMock();
  setupReleaseCreateMock();
  setupReleaseUploadAssetMock();
  setupRateLimitMock();
};

const creationFlow = async (): Promise<void> => {
  const version = await run(
    'main',
    1,
    true,
    '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>'
  );

  expect(version).to.equal(
    JSON.stringify(
      JSON.parse(
        readFileSync(
          resolve(__dirname, 'outputs', 'version-output.json')
        ).toString()
      )
    )
  );
};

const releaseTrackOutput = async (): Promise<void> => {
  const version = await run(
    'main',
    1,
    false,
    '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>'
  );

  expect(version).to.equal(
    JSON.stringify(
      JSON.parse(
        readFileSync(
          resolve(__dirname, 'outputs', 'version-output.json')
        ).toString()
      )
    )
  );
};

const testFallbackVersion = (): void => {
  it('should fallback to a default version when no tag', async () => {
    const version = await generateVersion(
      'main',
      1,
      '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>',
      null
    );

    expect(version.triggers.bump).to.equal(CategoryBump.none);
    expect(version.version.versionString).to.equal('1.0.0-main/#1');
  });
};

const testDefaultVersionNumber = (): void => {
  it('should fallback to a default version when no string', () => {
    settings({
      defaults: {
        version: '',
        track: 'main',
        changelog: { message: { public: '', private: '' } },
      },
    });
    const version = generateDefaultVersionNumber(
      'main',
      1,
      '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>'
    );

    expect(version.versionString).to.equal('1.0.0-main/#1');
  });
};

describe('Main Run', () => {
  beforeEach(setupMocks);
  after(() => {
    nock.cleanAll();
  });

  it('should have correct output for release track', releaseTrackOutput);
  it('should have correct response for non existent track', () => {
    expect(
      run('non_existent', 1, false, '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>')
    ).to.throw;
  });
  it('should have correct creation flow', creationFlow);
  testFallbackVersion();
  testDefaultVersionNumber();
});
