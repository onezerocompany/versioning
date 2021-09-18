import { describe, it, beforeEach, afterEach } from 'mocha';
import { generateDefaultVersionNumber, run } from '../src/main';
import { expect, use } from 'chai';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import promised from 'chai-as-promised';
import * as nock from 'nock';
import {
  setupCommitMock,
  setupCommitsListMock,
  setupLatestsTagsMock,
  setupRateLimitMock,
  setupReleaseCreateMock,
  setupReleaseUploadAssetMock,
} from './mocks/mocks';

import { settings } from '../src/settings';

use(promised);

const setupMocks = (): void => {
  process.env.GITHUB_REPOSITORY = 'onezerocompany/test';
  setupCommitsListMock();
  setupCommitMock();
  setupLatestsTagsMock();
  setupReleaseCreateMock();
  setupReleaseUploadAssetMock();
  setupRateLimitMock();
};

const testCreation = (): void => {
  it('should have correct creation flow', async () => {
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
  });
};

const testReleaseTrackOutput = (): void => {
  it('should have correct output for release track', async () => {
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

const testEmptyTrack = (): void => {
  it('should fallback to a default track when empty track', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(
      run('', 1, false, '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>')
    ).to.eventually.throw();
  });
};

const testNonExistingTrack = (): void => {
  it('should have correct response for non existent track', () => {
    expect(
      run('non_existent', 1, false, '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>')
    ).to.throw;
  });
};

describe('Main Run', () => {
  beforeEach(setupMocks);
  afterEach(() => {
    nock.cleanAll();
  });
  testReleaseTrackOutput();
  testNonExistingTrack();
  testCreation();
  testDefaultVersionNumber();
  testEmptyTrack();
});
