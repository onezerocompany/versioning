import type { Category } from './categories/categories';
import {
  categories,
  resolveID as resolveCategory,
  CategoryScope,
} from './categories/categories';
import type { Change } from './change';
import { settings } from './settings';
import type { VersionChangelog } from './version';

const generateList = (
  changes: Change[],
  scope: CategoryScope
): Array<{ category: Category; changes: Change[] }> => {
  const filteredChanges = changes.filter(
    change => resolveCategory(change.category).scope === scope
  );
  const filteredCategories = categories.filter(category =>
    filteredChanges.some(
      change => resolveCategory(change.category).id === category.id
    )
  );

  return filteredCategories.map(category => ({
    category,
    changes: filteredChanges.filter(
      change => resolveCategory(change.category).id === category.id
    ),
  }));
};

const generateContent = (
  list: Array<{ category: Category; changes: Change[] }>
): string => {
  let output = '';

  // Loop through the items in the list
  for (const item of list) {
    output += `\n${item.category.title}:\n`;

    // Loop through the changes in this category
    for (const change of item.changes) {
      const toAdd = `- ${change.content}\n`;

      if (!output.includes(toAdd)) {
        output += toAdd;
      }
    }
  }

  return output.trim();
};

/**
 * Generates a changelog for a list of changes
 * @param {ChangelogType} scope the scope of this changelog
 * @param {Change[]} changes a list of changes to include in this changelog
 * @return {string} the generated changelog
 */
export const changelog = (
  scope: CategoryScope,
  changes: Change[]
): VersionChangelog => {
  const content = generateContent(generateList(changes, scope)).trim();

  // Add default changelog message if no changes were found
  if (content.length === 0) {
    if (scope === CategoryScope.public)
      return {
        content: settings().defaults.changelog.message.public,
        hasChanges: false,
      };

    return {
      content: settings().defaults.changelog.message.private,
      hasChanges: false,
    };
  }

  return { content, hasChanges: true };
};
