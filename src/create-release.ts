import { info } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import type { Version } from './version';

const jsonSpacing = 2;

/**
 * Creates a github release from a Version
 * @param {Version} version version info to use for the release
 */
export const createRelease = async (version: Version): Promise<void> => {
  info(`\ncreating release:\n${JSON.stringify(version, null, jsonSpacing)}\n`);

  const github = getOctokit(process.env.TOKEN ?? 'test');
  const release = await github.rest.repos.createRelease({
    ...context.repo,
    name: version.version.versionString,
    tag_name: version.version.versionString,
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
