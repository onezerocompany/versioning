import { Change } from './change';
import { categories } from './change-categories';

/**
 * convert commit message to list of changes
 * @param {string} message message to convert to changes
 * @param {string} ref reference for the commit this message is from
 * @return {Change[]}
 */
export function changesFromMessage(message: string, ref: string): Change[] {
  return message.split('\n').map((line: string) => {
    let change : Change | undefined = undefined;
    for (const category of categories) {
      for (const key of category.keys) {
        const keyMarker = `[${key}]>`;
        if (line.includes(keyMarker)) {
          const content = line.replace(keyMarker, '').trim();
          change = new Change(content, category, ref);
        }
      }
    }
    return change;
  }).filter((change) => change) as Change[];
}

/**
 * represents a commit in the git history
 */
export interface Commit {

  ref: string
  message: string
  title: string

}
