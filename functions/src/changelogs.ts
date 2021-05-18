import { Change } from "./change";
import { categories } from "./change-categories";

export enum ChangelogType {
  internal = 'internal',
  external = 'external'
}

export function changelog(type: ChangelogType, changes: Change[]) {
  
  let filteredChanges = changes.filter(change => change.category.changelog_type == type)
  let filteredCategories = categories.filter(
    category => filteredChanges.some(
      change => change.category.keys[0] == category.keys[0]
    ) 
  )

  var changelog = ''
  for (let category of filteredCategories) {
    changelog += category.title + ':\n'
    let categoryChanges = filteredChanges.filter(change => change.category.keys[0] == category.keys[0])
    for (let change of categoryChanges) {
      changelog += '- ' + change.content + '\n'
    }
    changelog += '\n'
  }

  return changelog.trim()

}