import { describe, it } from 'mocha';
import { expect } from 'chai';
import {
  categories,
  resolveID,
  resolveTag,
  validateTag,
} from '../src/categories/categories';
import { output as labels } from '../src/categories/labels';

describe('Categories', () => {
  it('non existent category should return misc', () => {
    expect(resolveID('non_existent').id).to.equal('misc');
  });
  it('new feature should return new feature category', () => {
    expect(resolveID('feat-new').id).to.equal('feat-new');
  });
  it('feat(remove) tag should return Removed Features category', () => {
    expect(resolveTag('feat(remove)').id).to.equal('feat-remove');
  });
  it('invalid tag should return false', () => {
    expect(validateTag('invalid')).to.equal(false);
  });
  it('valid tag should return true', () => {
    expect(validateTag('feat')).to.equal(true);
  });
  it('labels output should contain all labels', () => {
    for (const label of categories.map(category => category.label)) {
      expect(labels).to.contain(label);
    }
  });
});
