import { context, getOctokit } from '@actions/github';
import { parseAllDocuments } from 'yaml';
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

const getCommitsList = async (
  track: string
): Promise<
  Array<{
    sha: string;
    parents: string[];
    message: string;
  }>
> => {
  const github = getOctokit(process.env.TOKEN ?? 'test');

  return (
    await github.rest.repos.listCommits({
      ...context.repo,
      per_page: 100,
      sha: track,
    })
  ).data
    .sort((lhs, rhs) => commitSorter(lhs, rhs))
    .filter(commit => commit.commit.author?.date)
    .map(commit => ({
      sha: commit.sha,
      parents: commit.parents.map(parent => parent.sha),
      message: commit.commit.message,
    }));
};

/**
 * Get commits from commit sha on
 * @param {string} track name of track
 * @param {string} commitSha sha for commit
 */
export const commitsFrom = async (
  track: string,
  commitSha: string
): Promise<Commit[]> => {
  const list = await getCommitsList(track);
  const commits: Commit[] = [];

  for (const commit of list) {
    if (commit.sha === commitSha || commit.parents.includes(commitSha)) break;

    if (!commitIsMerge(commit.message)) {
      commits.push({
        ref: commit.sha,
        message: commit.message,
      });
    }
  }

  return commits.reverse();
};
