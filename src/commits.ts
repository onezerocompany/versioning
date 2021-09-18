import { context, getOctokit } from '@actions/github';
import type { Commit } from './commit';

const commitIsMerge = (message: string): boolean => {
  const title = message.split('\n')[0].toLowerCase();

  return title.includes('merge pull request') || title.includes('merge branch');
};

const commitSorter = (
  lhs: {
    commit: { author: { date?: string } | null };
  },
  rhs: {
    commit: { author: { date?: string } | null };
  }
): number =>
  new Date(lhs.commit.author?.date ?? '').getTime() <
  new Date(rhs.commit.author?.date ?? '').getTime()
    ? 1
    : -1;

// eslint-disable-next-line max-lines-per-function
const getCommitsList = async (
  track: string,
  since: Date
): Promise<
  Array<{
    sha: string;
    parents: string[];
    message: string;
    date: Date | undefined;
  }>
> => {
  const github = getOctokit(process.env.TOKEN ?? 'test');
  let date = new Date().toISOString();

  try {
    date = since.toISOString();
  } catch {
    /**/
  }

  return (
    await github.rest.repos.listCommits({
      ...context.repo,
      per_page: 100,
      sha: track,
      since: date,
    })
  ).data
    .sort((lhs, rhs) => commitSorter(lhs, rhs))
    .map(commit => ({
      sha: commit.sha,
      parents: commit.parents.map(parent => parent.sha),
      message: commit.commit.message,
      date:
        typeof commit.commit.author?.date === 'string'
          ? new Date(commit.commit.author.date)
          : // eslint-disable-next-line no-undefined
            undefined,
    }))
    .filter(commit => commit.date);
};

/**
 * Get commits from commit sha on
 * @param {string} track name of track
 * @param {string} commitSha sha for commit
 */
export const commitsFrom = async (
  track: string,
  since: Date
): Promise<Commit[]> => {
  const list = await getCommitsList(track, since);
  const commits: Commit[] = [];

  for (const commit of list) {
    if (!commitIsMerge(commit.message)) {
      commits.push({
        ref: commit.sha,
        message: commit.message,
      });
    }
  }

  return commits.reverse();
};
