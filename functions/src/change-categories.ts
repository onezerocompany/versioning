import { ChangelogType } from './changelogs';
import { VersionBump } from './version-number';

export interface ChangeCategory {
  title: string
  description: string
  keys: string[]
  version_bump: VersionBump
  run_tests: boolean
  triggers_release: boolean
  changelog_type: ChangelogType
}

export const categories : ChangeCategory[] = [
  {
    title: 'New Features',
    description: 'Features that were not in the product yet',
    keys: [ 'feat', 'feature', 'features', 'new', 'new-feature', 'added', 'added-feature' ],
    version_bump: VersionBump.minor,
    run_tests: true,
    triggers_release: true,
    changelog_type: ChangelogType.external
  },
  {
    title: 'Changes',
    description: 'Changes made to previously released features or feature removals',
    keys: [ 'change', 'changes', 'feat-update' ],
    version_bump: VersionBump.minor,
    run_tests: true,
    triggers_release: true,
    changelog_type: ChangelogType.external
  },
  {
    title: 'Bug Fixes',
    description: 'A fix that resolves a previously found bug',
    keys: [ 'bug', 'bugs', 'fix', 'bug-fix' ],
    version_bump: VersionBump.patch,
    run_tests: true,
    triggers_release: true,
    changelog_type: ChangelogType.external
  },
  {
    title: 'Added Languages',
    description: 'Adding a new supported language to the app or website',
    keys: [ 'lang', 'language', 'added-language', 'add-lang' ],
    version_bump: VersionBump.minor,
    run_tests: true,
    triggers_release: true,
    changelog_type: ChangelogType.external
  },
  {
    title: 'Language Changes',
    description: 'Fixes or improvements to translations and/or removals of languages',
    keys: [ 'lang-update', 'language-update', 'lang-change', 'language-changes', 'updated-language', 'update-lang' ],
    version_bump: VersionBump.minor,
    run_tests: true,
    triggers_release: true,
    changelog_type: ChangelogType.external
  },
  {
    title: 'CI/CD Changes',
    description: 'Changes made to the CI and/or CD system',
    keys: [ 'ci', 'ci/cd', 'cd', 'continuous-integration', 'continuous-deployment' ],
    version_bump: VersionBump.none,
    run_tests: true,
    triggers_release: false,
    changelog_type: ChangelogType.internal
  },
  {
    title: 'Added Tests',
    description: 'Adding a new test to either UI, unit or integration test suites',
    keys: [ 'tests', 'testing', 'test', 'tst', 'unit-test', 'ui-test', 'integration-test' ],
    version_bump: VersionBump.none,
    run_tests: true,
    triggers_release: false,
    changelog_type: ChangelogType.internal
  },
  {
    title: 'Changed Tests',
    description: 'Changes made to tests or removals of tests in either UI, unit or integration test suites',
    keys: [ 'changed-tests', 'testing-change', 'test-change', 'tst-change', 'unit-test-change', 'ui-test-change', 'integration-test-change' ],
    version_bump: VersionBump.none,
    run_tests: true,
    triggers_release: false,
    changelog_type: ChangelogType.internal
  },
  {
    title: 'Documentation Changes',
    description: 'Changes made to documentation',
    keys: [ 'documentation', 'doc', 'docs' ],
    version_bump: VersionBump.none,
    run_tests: false,
    triggers_release: false,
    changelog_type: ChangelogType.internal
  },
  {
    title: 'Metadata Changes',
    description: 'Changes made to the application metadata',
    keys: [ 'meta', 'metadata', 'meta-changes' ],
    version_bump: VersionBump.patch,
    run_tests: true,
    triggers_release: true,
    changelog_type: ChangelogType.internal
  },
  {
    title: 'Refactored Code',
    description: 'Changes made to code that do not change functionality',
    keys: [ 'refactor', 'refactoring', 'refactored-code' ],
    version_bump: VersionBump.none,
    run_tests: true,
    triggers_release: false,
    changelog_type: ChangelogType.internal
  },
  {
    title: 'Miscellaneous Changes',
    description: 'Changes made to a repository that do not change anything relating to the code and do not fit any other description',
    keys: [ 'miscellaneous', 'misc', 'chore' ],
    version_bump: VersionBump.none,
    run_tests: false,
    triggers_release: false,
    changelog_type: ChangelogType.internal
  }
];