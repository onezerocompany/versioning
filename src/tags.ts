import { VersionNumber } from './version-number';
import { context, getOctokit } from '@actions/github';
import { getInput } from '@actions/core';

export interface RepoInfo {
  owner: string
  repo: string
}

export interface Tag {
  versionNumber: VersionNumber | undefined,
  commit: string
}

/**
 * get latest release for track
 * @param {VersionTrack} track track to search release in
 * @return {Tag}
 */
export async function latestTag(track: string):
  Promise<Tag | undefined> {
  const github = getOctokit(getInput('token') || 'test');
  // eslint-disable-next-line require-jsdoc
  async function loop(page = 1) {
    const tags = (await github.rest.repos
      .listTags({ ...context.repo, page })).data;
    if (tags.length == 0) return undefined;
    for (const tag of tags) {
      if (tag.name.indexOf(`-${track}`) > -1) {
        return {
          versionNumber: VersionNumber.fromVersionString(tag.name),
          commit: tag.commit.sha,
        };
      }
    }
    return await loop(page + 1);
  }
  return await loop();
}
