import { describe, it } from 'mocha';
import { expect } from 'chai';
import type { Category } from '../src/categories/categories';
import {
  bumpOrder,
  categories,
  CategoryBump,
} from '../src/categories/categories';

const minimumDescription =
  (category: Category): (() => void) =>
  (): void => {
    const expectedDescriptionLength = 10;

    expect(category.description).to.have.a.lengthOf.at.least(
      expectedDescriptionLength
    );
  };

const minimumKeys =
  (category: Category): (() => void) =>
  (): void => {
    const minimumAmountOfKeys = 2;

    expect(category.tags)
      .to.be.an('array')
      .and.have.a.lengthOf.at.least(minimumAmountOfKeys);
  };

const releaseBump =
  (category: Category): (() => void) =>
  (): void => {
    if (category.triggers.release) {
      expect(category.bump).to.be.oneOf([
        CategoryBump.major,
        CategoryBump.minor,
        CategoryBump.patch,
      ]);
    }
  };

describe('Category Information', () => {
  for (const category of categories) {
    describe(category.title, () => {
      it(
        'has a description with more than 10 characters',
        minimumDescription(category)
      );
      it('has more than 2 keys', minimumKeys(category));
      it('has a version bump assigned', () => {
        expect(category.bump).to.be.oneOf(bumpOrder);
      });
      it('runs tests if it releases', () => {
        if (category.triggers.release) {
          expect(category.triggers.test).to.equal(true);
        }
      });
      it('bumps version if it releases', releaseBump(category));
      it('does not do a major version bump', () => {
        expect(category.bump).to.not.equal(CategoryBump.major);
      });
    });
  }
});
