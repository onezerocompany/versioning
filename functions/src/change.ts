import { ChangeCategory } from './change-categories';
import { createHash } from 'crypto'

export class Change {

  ref: string // the unique reference for this change
  content: string
  category: ChangeCategory

  constructor(content: string, category: ChangeCategory, commit: string) {
    this.ref = createHash('md5').update(commit + content).digest('base64')
    this.content = content
    this.category = category
  }

}