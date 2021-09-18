import { VersionNumber } from './version-number';
import { context, getOctokit } from '@actions/github';

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

const getCommitDate = async (sha: string): Promise<Date> => {
  const github = getOctokit(process.env.TOKEN ?? 'test');

  return new Date(
    (
      await github.rest.repos.getCommit({
        ...context.repo,
        ref: sha,
      })
    ).data.commit.author?.date ?? ''
  );
};

/**
 * Get latest release for track
 * @param {VersionTrack} track track to search release in
 * @return {Tag}
 */
export const latestTag = async (
  track: string,
  template: string | null = null
): Promise<{ tag: Tag; date: Date } | null> => {
  const github = getOctokit(process.env.TOKEN ?? 'test');

  const loop = async (page = 1): Promise<Tag | null> => {
    const tags = (await github.rest.repos.listTags({ ...context.repo, page }))
      .data;

    if (tags.length === 0) return null;
    const foundTag = loopTags(track, tags, template);

    if (foundTag) return foundTag;

    return loop(page + 1);
  };

  const tag = await loop();

  if (!tag) return null;

  const date = await getCommitDate(tag.commit);

  return { tag, date };
};
