import { info } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import type { Version } from './version';

/**
 * Creates a github release from a Version
 * @param {Version} version version info to use for the release
 */
export const createRelease = async (version: Version): Promise<void> => {
  const github = getOctokit(process.env.TOKEN ?? 'test');
  const release = await github.rest.repos.createRelease({
    ...context.repo,
    name: version.version.versionString,
    tag_name: version.version.versionString,
    // eslint-disable-next-line id-denylist
    body: `${version.changelogs.public.content}${
      version.changelogs.private.hasChanges
        ? `\n---\n${version.changelogs.private.content}`
        : ''
    }`,
    target_commitish: version.version.track,
  });

  info(`creating ${version.version.versionString}: status ${release.status}`);

  const asset = await github.rest.repos.uploadReleaseAsset({
    ...context.repo,
    release_id: release.data.id,
    name: 'version.json',
    // eslint-disable-next-line id-denylist
    data: JSON.stringify(version),
  });

  info(`attaching version.json: status ${asset.status}`);
};
