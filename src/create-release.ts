import { getInput } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { Version } from './version-item';

/**
 * Creates a github release from a Version
 * @param {Version} version version info to use for the release
 */
export async function createRelease(version: Version): Promise<void> {
  const github = getOctokit(getInput('token') || 'test');
  const name = `v${version.version.versionString.full}`;
  const release = await github.rest.repos.createRelease({
    ...context.repo, name, tag_name: name,
    body: version.changelogs.external + '\n\n' + version.changelogs.internal,
    target_commitish: version.version.track,
  });
  await github.rest.repos.uploadReleaseAsset({
    ...context.repo,
    release_id: release.data.id,
    name: 'version.json',
    data: JSON.stringify(version),
  });
}
