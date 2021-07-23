import { getInput } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import type { Version } from './version';

/**
 * Creates a github release from a Version
 * @param {Version} version version info to use for the release
 */
export const createRelease = async (version: Version): Promise<void> => {
  const github = getOctokit(getInput('token') || 'test');
  const name = version.version.versionString;
  const release = await github.rest.repos.createRelease({
    ...context.repo,
    name,
    tag_name: name,
    // eslint-disable-next-line id-denylist
    body: `${version.changelogs.public}\n\n${version.changelogs.private}`,
    target_commitish: version.version.track,
  });

  await github.rest.repos.uploadReleaseAsset({
    ...context.repo,
    release_id: release.data.id,
    name: 'version.json',
    // eslint-disable-next-line id-denylist
    data: JSON.stringify(version),
  });
};
