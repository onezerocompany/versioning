import { Change } from './change';
import { categories } from './change-categories';

/**
 * Defines who gets to see the changelog
 */
export enum ChangelogType {
  internal = 'internal',
  external = 'external'
}

/**
 * Generates a changelog for a list of changes
 * @param {ChangelogType} type the type of this changelog
 * @param {Change[]} changes a list of changes to include in this changelog
 * @return {string} the generated changelog
 */
export function changelog(type: ChangelogType, changes: Change[]): string {
  const filteredChanges = changes
    .filter((change) => change.category.changelogType == type);
  const filteredCategories = categories.filter(
    (category) => filteredChanges.some(
      (change) => change.category.keys[0] == category.keys[0]
    )
  );

  let changelog = '';
  for (const category of filteredCategories) {
    changelog += category.title + ':\n';
    const categoryChanges = filteredChanges
      .filter((change) => change.category.keys[0] == category.keys[0]);
    for (const change of categoryChanges) {
      changelog += '- ' + change.content + '\n';
    }
    changelog += '\n';
  }
  return changelog.trim();
}
