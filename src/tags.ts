import { VersionNumber } from './version-number';
import { context, getOctokit } from '@actions/github';
import { getInput } from '@actions/core';

export interface RepoInfo {
  owner: string;
  repo: string;
}

export interface Tag {
  versionNumber: VersionNumber | undefined;
  commit: string;
}

/**
 * Get latest release for track
 * @param {VersionTrack} track track to search release in
 * @return {Tag}
 */
export const latestTag = async (track: string): Promise<Tag | null> => {
  const github = getOctokit(getInput('token') || 'test');

  // eslint-disable-next-line require-jsdoc
  const loop = async (page = 1): Promise<Tag | null> => {
    const tags = (await github.rest.repos.listTags({ ...context.repo, page }))
      .data;

    if (tags.length === 0) return null;

    for (const tag of tags) {
      if (tag.name.includes(`-${track}`)) {
        return {
          versionNumber: VersionNumber.fromVersionString(tag.name),
          commit: tag.commit.sha,
        };
      }
    }

    return loop(page + 1);
  };

  return loop();
};
