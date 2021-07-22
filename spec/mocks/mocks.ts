import { readFileSync } from 'fs';
import nock from 'nock';
import { resolve } from 'path';
import type { ParsedUrlQuery } from 'querystring';

enum Method {
  get = 'get',
  post = 'post',
}

interface MockParams {
  origin?: string;
  url: string;
  file: string;
  status?: number;
  method?: Method;
  query?: ParsedUrlQuery;
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
        JSON.parse(
          readFileSync(resolve(__dirname, 'data', params.file)).toString()
        ) as Array<[key: string, value: unknown]>
      );
  }

  return nock(params.origin ?? 'https://api.github.com')
    .persist()
    .get(params.url)
    .reply(
      params.status ?? createdSuccessfully,
      JSON.parse(
        readFileSync(resolve(__dirname, 'data', params.file)).toString()
      ) as Array<[key: string, value: unknown]>
    );
};

export const setupCommitsListMock = (): nock.Scope =>
  setupMock({
    url: '/repos/onezerocompany/test/commits?per_page=100&sha=main',
    file: 'commits-list.json',
  });

export const setupRateLimitMock = (): nock.Scope =>
  setupMock({
    url: '/rate_limit',
    file: 'rate-limit.json',
    status: createdSuccessfully,
  });

export const setupReleaseCreateMock = (): nock.Scope =>
  setupMock({
    url: '/repos/onezerocompany/test/releases',
    file: 'release-create.json',
    status: createdSuccessfully,
    method: Method.post,
  });

export const setupReleaseUploadAssetMock = (): nock.Scope =>
  setupMock({
    origin: 'https://uploads.github.com',
    url: '/repos/onezerocompany/test/releases/52347890/assets',
    file: 'release-upload.json',
    query: { name: 'version.json' },
    status: createdSuccessfully,
    method: Method.post,
  });

export const setupLatestsTagsMock = (): void => {
  setupMock({
    url: '/repos/onezerocompany/test/tags?page=1',
    file: 'latest-tags-page1.json',
  });
  setupMock({
    url: '/repos/onezerocompany/test/tags?page=2',
    file: 'latest-tags-page2.json',
  });
  setupMock({
    url: '/repos/onezerocompany/test/tags?page=3',
    file: 'empty-list.json',
  });
};
