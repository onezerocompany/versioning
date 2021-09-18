import { describe, it, beforeEach, afterEach } from 'mocha';
import { generateVersion, run } from '../src/main';
import { expect, use } from 'chai';
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
import { readFileSync } from 'fs';
import { resolve } from 'path';

use(promised);

const setupMocks = (): void => {
  process.env.GITHUB_REPOSITORY = 'onezerocompany/test';
  setupCommitMock(true);
  setupCommitsListMock();
  setupLatestsTagsMock();
  setupReleaseCreateMock();
  setupReleaseUploadAssetMock();
  setupRateLimitMock();
};

const testCreation = (): void => {
  it('should throw error when no previous tag exists', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(
      run('new', 1, true, '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>')
    ).to.eventually.throw();
  });
};

const testCreationWithNoTagDate = (): void => {
  it('should have now date when no tag date', async () => {
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

const testGenerationWithoutTag = (): void => {
  it('should throw error when generating without tag', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(
      generateVersion({
        track: 'main',
        build: 1,
        template: '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>',
        date: new Date(),
      })
    ).to.eventually.throw();
  });
};

describe('Main Run', () => {
  beforeEach(setupMocks);
  afterEach(() => {
    nock.cleanAll();
  });

  testCreation();
  testCreationWithNoTagDate();
  testGenerationWithoutTag();
});
