import type { Category } from './categories/categories';
import {
  categories,
  resolveID as resolveCategory,
  CategoryScope,
} from './categories/categories';
import type { Change } from './change';
import { settings } from './settings';

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

/**
 * Generates a changelog for a list of changes
 * @param {ChangelogType} scope the scope of this changelog
 * @param {Change[]} changes a list of changes to include in this changelog
 * @return {string} the generated changelog
 */
export const changelog = (scope: CategoryScope, changes: Change[]): string => {
  const list = generateList(changes, scope);
  let output = '';

  // Loop through the items in the list
  for (const item of list) {
    output += `${item.category.title}:\n`;

    // Loop through the changes in this category
    for (const change of item.changes) {
      const toAdd = `- ${change.content}\n`;

      if (!output.includes(toAdd)) {
        output += toAdd;
      }
    }
  }

  // Add default changelog message if no changes were found
  if (output.length === 0) {
    if (scope === CategoryScope.public)
      output = settings().defaults.changelog.message.public;
    if (scope === CategoryScope.private)
      output = settings().defaults.changelog.message.private;
  }

  return output.trim();
};
