import { ChangelogType } from './changelogs';
import { VersionBump } from './version-number';

export interface ChangeCategory {
  title: string
  description: string
  keys: string[]
  versionBump: VersionBump
  triggers: {
    tests: boolean,
    release: boolean
  }
  changelogType: ChangelogType
}

export const categories : ChangeCategory[] = [
  {
    title: 'New Features',
    description: 'Features that were not in the product yet',
    keys: [
      'feat', 'feature', 'features', 'new',
      'new-feature', 'added', 'added-feature',
    ],
    versionBump: VersionBump.minor,
    triggers: {
      tests: true,
      release: true,
    },
    changelogType: ChangelogType.external,
  },
  {
    title: 'Changes',
    // eslint-disable-next-line max-len
    description: 'Changes made to previously released features or feature removals',
    keys: ['change', 'changes', 'feat-update'],
    versionBump: VersionBump.minor,
    triggers: {
      tests: true,
      release: true,
    },
    changelogType: ChangelogType.external,
  },
  {
    title: 'Bug Fixes',
    description: 'A fix that resolves a previously found bug',
    keys: ['bug', 'bugs', 'fix', 'bug-fix'],
    versionBump: VersionBump.patch,
    triggers: {
      tests: true,
      release: true,
    },
    changelogType: ChangelogType.external,
  },
  {
    title: 'Added Languages',
    description: 'Adding a new supported language to the app or website',
    keys: ['lang', 'language', 'added-language', 'add-lang'],
    versionBump: VersionBump.minor,
    triggers: {
      tests: true,
      release: true,
    },
    changelogType: ChangelogType.external,
  },
  {
    title: 'Language Changes',
    // eslint-disable-next-line max-len
    description: 'Fixes or improvements to translations and/or removals of languages',
    keys: [
      'lang-update', 'language-update', 'lang-change',
      'language-changes', 'updated-language', 'update-lang',
    ],
    versionBump: VersionBump.minor,
    triggers: {
      tests: true,
      release: true,
    },
    changelogType: ChangelogType.external,
  },
  {
    title: 'CI/CD Changes',
    description: 'Changes made to the CI and/or CD system',
    keys: [
      'ci', 'ci/cd', 'cd', 'continuous-integration', 'continuous-deployment',
    ],
    versionBump: VersionBump.none,
    triggers: {
      tests: true,
      release: false,
    },
    changelogType: ChangelogType.internal,
  },
  {
    title: 'Added Tests',
    // eslint-disable-next-line max-len
    description: 'Adding a new test to either UI, unit or integration test suites',
    keys: [
      'tests', 'testing', 'test', 'tst',
      'unit-test', 'ui-test', 'integration-test',
    ],
    versionBump: VersionBump.none,
    triggers: {
      tests: true,
      release: false,
    },
    changelogType: ChangelogType.internal,
  },
  {
    title: 'Changed Tests',
    // eslint-disable-next-line max-len
    description: 'Changes made to tests or removals of tests in either UI, unit or integration test suites',
    keys: [
      'changed-tests', 'testing-change', 'test-change', 'tst-change',
      'unit-test-change', 'ui-test-change', 'integration-test-change',
    ],
    versionBump: VersionBump.none,
    triggers: {
      tests: true,
      release: false,
    },
    changelogType: ChangelogType.internal,
  },
  {
    title: 'Documentation Changes',
    description: 'Changes made to documentation',
    keys: ['documentation', 'doc', 'docs'],
    versionBump: VersionBump.none,
    triggers: {
      tests: false,
      release: false,
    },
    changelogType: ChangelogType.internal,
  },
  {
    title: 'Metadata Changes',
    description: 'Changes made to the application metadata',
    keys: ['meta', 'metadata', 'meta-changes'],
    versionBump: VersionBump.patch,
    triggers: {
      tests: true,
      release: true,
    },
    changelogType: ChangelogType.internal,
  },
  {
    title: 'Refactored Code',
    description: 'Changes made to code that do not change functionality',
    keys: ['refactor', 'refactoring', 'refactored-code'],
    versionBump: VersionBump.none,
    triggers: {
      tests: true,
      release: false,
    },
    changelogType: ChangelogType.internal,
  },
  {
    title: 'Miscellaneous Changes',
    // eslint-disable-next-line max-len
    description: 'Changes made to a repository that do not change anything relating to the code and do not fit any other description',
    keys: ['miscellaneous', 'misc', 'chore'],
    versionBump: VersionBump.none,
    triggers: {
      tests: false,
      release: false,
    },
    changelogType: ChangelogType.internal,
  },
];
