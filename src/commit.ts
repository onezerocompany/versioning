import { resolveTag } from './categories/categories';
import { Change } from './change';

export const tagRegex =
  /^(?<tag>[a-z]*(?:(?:[(]{1}[a-z]*[)]{1})|(?:[-][a-z]*))?)(?: ->)(?<message>.*)/u;

export const breakingRegex = /^BREAKING(?:\.?)$/u;

/**
 * Convert commit message to list of changes
 * @param {string} content message to convert to changes
 * @param {string} ref reference for the commit this message is from
 * @return {Change[]}
 */
export const changesFromMessage = (
  content: string,
  ref: string
): { changes: Change[]; breaking: boolean } => {
  let breaking = false;
  const changes = content
    .split('\n')
    .map((line: string) => {
      if (breakingRegex.exec(line) !== null) {
        breaking = true;

        return null;
      }

      const results = tagRegex.exec(line);
      const category = resolveTag(results?.groups?.tag ?? '');
      const message = results?.groups?.message.trim();

      if (typeof category !== 'undefined' && typeof message !== 'undefined') {
        return new Change(message, category.id, ref);
      }

      return null;
    })
    .filter(change => change !== null) as Change[];

  return { changes, breaking };
};

/**
 * Represents a commit in the git history
 */
export interface Commit {
  ref: string;
  message: string;
}
