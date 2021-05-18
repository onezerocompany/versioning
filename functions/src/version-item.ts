import { ChangeCategory } from './change-categories';
import { VersionNumber } from './version-number';
import { Change } from './change';
import { changelog, ChangelogType } from './changelogs';

export enum VersionTrack {
  release = 'release',
  beta = 'beta',
  alpha = 'alpha'
}

export interface VersionExport {
  components: VersionNumber
  string: string
  track: VersionTrack
}

export interface ChangeExport {
  ref: string
  changeInfo: ChangeCategory
  content: string
}

export class Version {

  version: VersionExport
  changes: Change[]
  changelogs: {
    internal: string,
    external: string
  }
  flags: {
    release: boolean
    beta_release: boolean
    alpha_release: boolean
  }

  constructor(track: VersionTrack, version: VersionNumber, changes: Change[]) {
    this.version = {
      components: version,
      string: version.versionString(track),
      track: track
    }
    this.changes = changes
    this.changelogs = {
      internal: changelog(ChangelogType.internal, changes),
      external: changelog(ChangelogType.external, changes),
    }
    this.flags = {
      release: false,
      beta_release: false,
      alpha_release: false
    }
  }
  
}