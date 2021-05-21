import { ChangeCategory } from './change-categories';
import { createHash } from 'crypto';

/**
 * Represents a single change in a changlog
 */
export class Change {

  ref: string;
  content: string;
  category: ChangeCategory;

  /**
   * Creates a change
   * @param {string} content content of this change
   * @param {ChangeCategory} category category for this change
   * @param {string} commit commit ref for this change
   */
  constructor (content: string, category: ChangeCategory, commit: string) {

    this.ref = createHash('md5').update(commit + content).digest('base64');
    this.content = content;
    this.category = category;

  }

}
