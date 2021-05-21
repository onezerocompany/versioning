import { ChangeCategory } from './change-categories';
import { Change } from './change';
import { changelog, ChangelogType } from './changelogs';
import {
  VersionNumber, VersionBump, bumpOrder,
} from './version-number';
import { changesFromMessage, Commit } from './commit';

export interface ChangeExport {
  ref: string
  changeInfo: ChangeCategory
  content: string
}

export interface VersionInput {
  lastVersion: string
  lastRef: string
  commits: Commit[]
}

/**
 * contains all the information
 */
export class Version {

  version: VersionNumber
  lastRef: string
  changes: Change[]
  changelogs: {
    internal: string
    external: string
  }

  /**
   * creates a version
   * @param {VersionInput} input input from a version creation request
   */
  constructor(
    input: VersionInput
  ) {

    let bump = VersionBump.none;

    this.lastRef = input.lastRef;
    this.changes = input.commits.flatMap((commit) =>
      changesFromMessage(commit.message, commit.ref)
    );
    this.changelogs = {
      internal: changelog(ChangelogType.internal, this.changes),
      external: changelog(ChangelogType.external, this.changes),
    };

    for (const change of this.changes) {

      const oldIndex = bumpOrder.indexOf(bump);
      const index = bumpOrder.indexOf(change.category.versionBump);
      if (index > oldIndex) bump = change.category.versionBump;

    }

    this.version = VersionNumber
      .fromVersionString(input.lastVersion)
      .bumped(bump);

  }

}
