import { describe, it } from 'mocha';
import { expect } from 'chai';
import { categories } from '../src/change-categories';
import { Change } from '../src/change';
import { changelog, ChangelogType } from '../src/changelogs';

describe('Changelogs', () => {
  const changes = categories.flatMap((category) => {
    return [
      new Change('something new, old or different', category, 'somecommit'),
      new Change('something else', category, 'somecommit'),
    ];
  });

  const internal = changelog(ChangelogType.internal, changes);
  const external = changelog(ChangelogType.external, changes);

  describe('external', () => {
    it('should have no internal categories', () => {
      const unwantedTitles = categories
        .filter((category) => category.changelogType == ChangelogType.internal)
        .map((category) => category.title);
      for (const title of unwantedTitles) {
        expect(external).to.not.contain(title + ':');
      }
    });
    it('should not begin or end with whitelines', () => {
      expect(external[0]).to.not.equal('\n').and.to.not.equal('\r');
      expect(external[external.length - 1]).to.not
        .equal('\n').and.to.not.equal('\r');
    });
    it('should have correct empty response', () => {
      expect(changelog(ChangelogType.external, []))
        .to.equal('Bug Fixes:\n- minor bug fixes');
    });
  });

  describe('internal', () => {
    it('should have no external categories', () => {
      const unwantedTitles = categories
        .filter((category) => category.changelogType == ChangelogType.external)
        .map((category) => category.title)
        .filter((title) => title != 'Changes');
      for (const title of unwantedTitles) {
        expect(internal).to.not.contain(title + ':');
      }
    });
    it('should not begin or end with whitelines', () => {
      expect(internal[0]).to.not.equal('\n').and.to.not.equal('\r');
      expect(internal[internal.length - 1]).to.not
        .equal('\n').and.to.not.equal('\r');
    });
    it('should have correct empty response', () => {
      expect(changelog(ChangelogType.internal, []))
        .to.equal('- no changes');
    });
  });
});
