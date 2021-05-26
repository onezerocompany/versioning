import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ChangelogType } from './changelogs';
import { VersionBump } from './version-number';

export interface ChangeCategory {
  title: string
  description: string
  keys: string[]
  versionBump: VersionBump
  triggers: {
    tests: boolean,
    release: boolean
  }
  changelogType: ChangelogType
}

export const categories : ChangeCategory[] =
  JSON.parse(readFileSync(
    resolve(__dirname, '..', 'data', 'categories.json')
  ).toString());
