import type { Change } from './change';
import { changelog } from './changelogs';
import type { VersionNumber } from './version-number';
import type { Commit } from './commit';
import { changesFromMessage } from './commit';
import type { Category } from './categories/categories';
import {
  CategoryBump,
  CategoryScope,
  bumpOrder,
  resolveID as resolveCategory,
} from './categories/categories';

export interface ChangeExport {
  ref: string;
  changeInfo: Category;
  content: string;
}

export interface VersionInput {
  version: VersionNumber;
  commits: Commit[];
  foundTag: boolean;
}

export interface Triggers {
  bump: CategoryBump;
  release: boolean;
  tests: boolean;
}

/**
 * Contains all the information
 */
export class Version {
  public version: VersionNumber;
  public changes: Change[];
  public changelogs: {
    public: string;
    private: string;
  };

  public triggers: Triggers;

  /**
   * Creates a version
   * @param {VersionInput} input input from a version creation request
   */
  public constructor(input: VersionInput) {
    const { breaking, changes } = Version.changesFromCommits(input.commits);

    this.changes = changes;
    this.changelogs = {
      public: changelog(CategoryScope.public, changes),
      private: changelog(CategoryScope.private, changes),
    };

    const triggers = Version.triggersForChanges(changes);

    if (breaking) {
      triggers.bump = CategoryBump.major;
      triggers.release = true;
      triggers.tests = true;
    }

    if (!input.foundTag && !breaking) {
      triggers.bump = CategoryBump.minor;
      triggers.release = true;
      triggers.tests = true;
    }

    this.triggers = triggers;
    this.version = input.version.bumped(triggers.bump);
  }

  private static changesFromCommits(commits: Commit[]): {
    breaking: boolean;
    changes: Change[];
  } {
    let breaking = false;
    const changes: Change[] = [];

    for (const change of commits.flatMap(commit => {
      const messageChanges = changesFromMessage(commit.message, commit.ref);

      if (messageChanges.breaking) breaking = true;

      return messageChanges.changes;
    })) {
      if (
        typeof changes.find(item => item.ref === change.ref) === 'undefined'
      ) {
        changes.push(change);
      }
    }

    return { breaking, changes };
  }

  private static triggersForChanges(changes: Change[]): Triggers {
    const output: Triggers = {
      bump: CategoryBump.none,
      release: false,
      tests: false,
    };

    for (const change of changes) {
      const oldIndex = bumpOrder.indexOf(output.bump);
      const index = bumpOrder.indexOf(resolveCategory(change.category).bump);

      if (index > oldIndex) output.bump = resolveCategory(change.category).bump;
      if (resolveCategory(change.category).triggers.release)
        output.release = true;
      if (resolveCategory(change.category).triggers.test) output.tests = true;
    }

    return output;
  }
}
