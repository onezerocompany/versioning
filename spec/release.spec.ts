import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import nock from 'nock';

import { createRelease } from '../src/create-release';
import { Version } from '../src/version';
import { VersionNumber } from '../src/version-number';
import {
  setupCommitsListMock,
  setupLatestsTagsMock,
  setupRateLimitMock,
  setupReleaseCreateMock,
  setupReleaseUploadAssetMock,
} from './mocks/mocks';

const setup = (): void => {
  nock.cleanAll();
  setupCommitsListMock();
  setupRateLimitMock();
  setupLatestsTagsMock();
  process.env.GITHUB_REPOSITORY = 'onezerocompany/test';
};

const maxTimeout = 10000;

const shouldCreateRelease = (): void => {
  it('should create release', async () => {
    const create = setupReleaseCreateMock();
    const upload = setupReleaseUploadAssetMock();
    const version = new Version({
      version: new VersionNumber({ major: 1, minor: 0, patch: 0 }).switchTracks(
        'main',
        1
      ),
      commits: [
        {
          message:
            'feat(new) -> new feature\nfeat(fix) -> a fix\ndoc -> added a doc',
          ref: 'commit-ref',
        },
      ],
      foundTag: false,
    });

    await createRelease(version);
    expect(create.isDone()).to.equal(true);
    expect(upload.isDone()).to.equal(true);
  }).timeout(maxTimeout);
};

describe('Create Release', () => {
  beforeEach(setup);
  afterEach(() => {
    nock.cleanAll();
  });
  shouldCreateRelease();
});
