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

const loopTags = (
  track: string,
  tags: Array<{ name: string; commit: { sha: string } }>,
  template: string | null
): Tag | null => {
  for (const tag of tags) {
    const version = VersionNumber.fromVersionString(
      tag.name,
      template ?? '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>'
    );

    if (version.track === track) {
      return {
        versionNumber: version,
        commit: tag.commit.sha,
      };
    }
  }

  return null;
};

/**
 * Get latest release for track
 * @param {VersionTrack} track track to search release in
 * @return {Tag}
 */
export const latestTag = async (
  track: string,
  template: string | null = null
): Promise<Tag | null> => {
  const github = getOctokit(getInput('token') || 'test');

  // eslint-disable-next-line require-jsdoc
  const loop = async (page = 1): Promise<Tag | null> => {
    const tags = (await github.rest.repos.listTags({ ...context.repo, page }))
      .data;

    if (tags.length === 0) return null;
    const tag = loopTags(track, tags, template);

    if (tag) return tag;

    return loop(page + 1);
  };

  return loop();
};
