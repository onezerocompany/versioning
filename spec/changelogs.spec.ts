import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Change } from '../src/change';
import { changelog } from '../src/changelogs';
import { categories, CategoryScope } from '../src/categories/categories';

describe('Public Categories', () => {
  const changes = categories.flatMap(category => [
    new Change('something new, old or different', category.id, 'somecommit'),
    new Change('something else', category.id, 'somecommit'),
  ]);
  const external = changelog(CategoryScope.public, changes);

  it('should have no internal categories', () => {
    const unwantedTitles = categories
      .filter(category => category.scope === CategoryScope.private)
      .map(category => category.title);

    for (const title of unwantedTitles) {
      expect(external.content).to.not.contain(`${title}:`);
    }
  });
  it('should not begin or end with whitelines', () => {
    expect(external.content[0]).to.not.equal('\n').and.to.not.equal('\r');
    expect(external.content[external.content.length - 1])
      .to.not.equal('\n')
      .and.to.not.equal('\r');
  });
  it('should have correct empty response', () => {
    expect(changelog(CategoryScope.public, []).content).to.equal(
      'Bug Fixes:\n- minor bug fixes'
    );
  });
});

describe('Private Categories', () => {
  const changes = categories.flatMap(category => [
    new Change('something new, old or different', category.id, 'somecommit'),
    new Change('something else', category.id, 'somecommit'),
  ]);
  const internal = changelog(CategoryScope.private, changes);

  it('should have no external categories', () => {
    const unwantedTitles = categories
      .filter(category => category.scope === CategoryScope.public)
      .map(category => category.title);

    for (const title of unwantedTitles) {
      expect(internal.content).to.not.contain(`${title}:`);
    }
  });
  it('should not begin or end with whitelines', () => {
    expect(internal.content[0]).to.not.equal('\n').and.to.not.equal('\r');
    expect(internal.content[internal.content.length - 1])
      .to.not.equal('\n')
      .and.to.not.equal('\r');
  });
  it('should have correct empty response', () => {
    expect(changelog(CategoryScope.private, []).content).to.equal(
      '- no changes'
    );
  });
});
