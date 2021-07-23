import { createHash } from 'crypto';

/**
 * Represents a single change in a changlog
 */
export class Change {
  public ref: string;
  public content: string;
  public category: string;

  /**
   * Creates a change
   * @param {string} content content of this change
   * @param {string} category category for this change
   * @param {string} commit commit ref for this change
   */
  public constructor(content: string, category: string, commit: string) {
    this.ref = createHash('md5')
      .update(commit + content)
      .digest('base64');
    this.content = content;
    this.category = category;
  }
}
