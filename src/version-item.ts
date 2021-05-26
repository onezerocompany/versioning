import { ChangeCategory } from './change-categories';
import { Change } from './change';
import { changelog, ChangelogType } from './changelogs';
import {
  VersionNumber, VersionBump, bumpOrder, VersionTrack,
} from './version-number';
import { changesFromMessage, Commit } from './commit';

export interface ChangeExport {
  ref: string
  changeInfo: ChangeCategory
  content: string
}

export interface VersionInput {
  version: string
  track: VersionTrack
  build: number
  commits: Commit[]
}

/**
 * contains all the information
 */
export class Version {

  version: VersionNumber
  changes: Change[]
  changelogs: {
    internal: string
    external: string
  }
  triggers: {
    release: boolean
    tests: boolean
  }

  /**
   * creates a version
   * @param {VersionInput} input input from a version creation request
   */
  constructor(
    input: VersionInput
  ) {
    let bump = VersionBump.none;

    this.changes = input.commits.flatMap((commit) =>
      changesFromMessage(commit.message, commit.ref)
    );
    this.changelogs = {
      internal: changelog(ChangelogType.internal, this.changes),
      external: changelog(ChangelogType.external, this.changes),
    };

    let triggersRelease = false;
    let triggersTests = false;
    for (const change of this.changes) {
      const oldIndex = bumpOrder.indexOf(bump);
      const index = bumpOrder.indexOf(change.category.versionBump);
      if (index > oldIndex) bump = change.category.versionBump;
      if (change.category.triggers.release) triggersRelease = true;
      if (change.category.triggers.tests) triggersTests = true;
    }

    this.triggers = {
      release: triggersRelease,
      tests: triggersTests,
    };

    this.version = VersionNumber
      .fromVersionString(input.version, input.track, input.build)
      .bumped(bump);
  }

}