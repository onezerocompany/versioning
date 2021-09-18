/* eslint-disable max-lines */
import nock from 'nock';
import type { ParsedUrlQuery } from 'querystring';

import type { RateLimitMock } from './ratelimit.mock';
import { MockTag } from './tag.mock';
import { MockCommit } from './commit.mock';
import { Release } from './release.mock';
import { ReleaseUpload } from './release.upload.moc';

enum Method {
  get = 'get',
  post = 'post',
}

interface MockParams {
  origin?: string;
  url: string;
  content: unknown;
  status?: number;
  method?: Method;
  query?: ParsedUrlQuery | boolean;
}

const createdSuccessfully = 201;
const responseSuccess = 200;

const setupMock = (params: MockParams): nock.Scope => {
  if (params.method === Method.post) {
    return nock(params.origin ?? 'https://api.github.com')
      .persist()
      .post(params.url)
      .query(params.query ?? {})
      .reply(
        params.status ?? responseSuccess,
        params.content as Record<string, unknown>
      );
  }

  return nock(params.origin ?? 'https://api.github.com')
    .persist()
    .get(params.url)
    .query(params.query ?? {})
    .reply(
      params.status ?? createdSuccessfully,
      params.content as Record<string, unknown>
    );
};

const commitList = [
  new MockCommit(
    '8F2C95D248F540178A48333F3BACB153',
    'Added a login button.\nfeat(new) -> added a new login button',
    '2021-02-27T19:35:32Z'
  ),
  new MockCommit(
    '646972F1D97145C98501D61944137CE7',
    'Fixed the authentication screen.\nfeat(fix) -> fixed the auth screen',
    '2021-02-25T19:35:32Z'
  ),
  new MockCommit(
    'E4A319A07AB140E89AE6F1EB6E6C0F90',
    'Added a logout button.\nfeat(new) -> added a logout button',
    '2021-02-26T19:35:32Z'
  ),
  new MockCommit(
    '41854F48FFEC48EB8C1FFB5CC756D3DE',
    'merge pull request -> merged a feature',
    '2021-02-21T19:35:32Z'
  ),
  new MockCommit(
    '64ABC247B3AB4B12B577BB3D6E637BCB',
    'Fixed an error.\nfeat(fix) -> fixed an error',
    null
  ),
  new MockCommit(
    'F4D1FB0C55144F248DFF6850F783A34E',
    'Fixed a lang error.\nlang(fix) -> fixed a language error',
    null
  ),
] as MockCommit[];

export const setupCommitsListMock = (): nock.Scope =>
  setupMock({
    url: '/repos/onezerocompany/test/commits',
    query: true,
    content: commitList,
  });

export const setupCommitMock = (emptyDate = false): void => {
  setupMock({
    url: '/repos/onezerocompany/test/commits/2C967C52975A4E38AF8F599CEFCBDB58',
    content: new MockCommit(
      '2C967C52975A4E38AF8F599CEFCBDB58',
      'Fixed a bug.\nfix(bug) -> fixed a bug',
      emptyDate ? null : '2021-02-27T19:35:32Z'
    ),
  });
};

export const setupRateLimitMock = (): nock.Scope =>
  setupMock({
    url: '/rate_limit',
    content: {
      rate: {
        limit: 5000,
        remaining: 4998,
        reset: 1580294800,
      },
    } as RateLimitMock,
    status: createdSuccessfully,
  });

const releaseId = 85907412234;

export const setupReleaseCreateMock = (): nock.Scope =>
  setupMock({
    url: '/repos/onezerocompany/test/releases',
    content: new Release(
      releaseId,
      'v1.0.0',
      'Changes:\n- made some changes',
      '2021-02-25T19:35:32Z'
    ),
    status: createdSuccessfully,
    method: Method.post,
  });

const releaseUploadId = 5267893253489;

export const setupReleaseUploadAssetMock = (): nock.Scope =>
  setupMock({
    origin: 'https://uploads.github.com',
    url: `/repos/onezerocompany/test/releases/${releaseId}/assets`,
    content: new ReleaseUpload(
      'version.json',
      releaseUploadId,
      'v1.0.0',
      '2021-02-25T19:35:32Z'
    ),
    query: { name: 'version.json' },
    status: createdSuccessfully,
    method: Method.post,
  });

export const setupLatestsTagsMock = (): void => {
  setupMock({
    url: '/repos/onezerocompany/test/tags',
    query: { page: '1' },
    content: [
      new MockTag('v2.0.0/#11', '2C967C52975A4E38AF8F599CEFCBDB58'),
      new MockTag('v1.1.2/#10', '4E5FDC8941B648198CECA23845305B04'),
      new MockTag('v1.1.1-alpha/#9', '763A5D7398AF4F308CE3CF861C3E94D6'),
      new MockTag('v1.1.0-alpha/#8', 'E59C36965CE04F9AAF5B80501085A404'),
      new MockTag('v1.0.0-alpha/#7', '82A436EE30EE42F4B23A9A88785EF796'),
    ] as MockTag[],
  });
  setupMock({
    url: '/repos/onezerocompany/test/tags',
    query: { page: '2' },
    content: [
      new MockTag('v0.2.0', 'D6927F16ACC34F23A032D9D61EE6EC35'),
      new MockTag('v0.1.1', 'B8E71C516CC24192B258F739EFCE3F0E'),
      new MockTag('v0.1.0', 'FAB82BCFFF63478CBEF3E47419BCFFAE'),
      new MockTag('v0.0.2', '531979003D6F49E39336F33001FC22A7'),
      new MockTag('v0.0.1', '6A42D5D13E6B46DA920D0AF7275C7FE9'),
    ] as MockTag[],
  });
  setupMock({
    url: '/repos/onezerocompany/test/tags',
    query: { page: '3' },
    content: [] as MockTag[],
  });
};
