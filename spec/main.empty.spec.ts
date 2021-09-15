import { describe, it, beforeEach, after } from 'mocha';
import { run } from '../src/main';
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

const setupMocks = (): void => {
  process.env.GITHUB_REPOSITORY = 'onezerocompany/test';
  nock.cleanAll();
  setupCommitsListMock();
  setupLatestsTagsMock();
  setupReleaseCreateMock();
  setupReleaseUploadAssetMock();
  setupRateLimitMock();
};

const testCreation = (): void => {
  it('should have correct creation flow when no previous versions', async () => {
    const version = await run(
      'new',
      1,
      true,
      '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>'
    );

    expect(version).to.equal(
      JSON.stringify(
        JSON.parse(
          readFileSync(
            resolve(__dirname, 'outputs', 'version-output-empty.json')
          ).toString()
        )
      )
    );
  });
};

describe('Main Run', () => {
  beforeEach(setupMocks);
  after(() => {
    nock.cleanAll();
  });

  testCreation();
});
