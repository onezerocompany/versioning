import { describe, it } from 'mocha';
import { expect } from 'chai';
import { validateMessage } from '../../src/validate/validate-message';

const shortTitle = (): void => {
  it('title with less than 10 characters should throw error', () => {
    const message = 'Title.\nfeat(new) -> added a new feature';
    const validation = validateMessage(message);

    expect(validation.valid).to.be.false;
    expect(validation.errors.length).to.equal(1);
    expect(validation.errors[0].message).to.equal(
      'Title should be at least 10 characters'
    );
    expect(validation.errors[0].scope).to.equal('title');
  });
};

const longTitle = (): void => {
  it('title with more than 68 characters should throw error', () => {
    const message =
      'This title is way too long to be a valid title in any way or form since it goes over 68 characters.\nfeat(new) -> added a new feature';
    const validation = validateMessage(message);

    expect(validation.valid).to.be.false;
    expect(validation.errors.length).to.equal(1);
    expect(validation.errors[0].message).to.equal(
      'Title should be less than 68 characters'
    );
    expect(validation.errors[0].scope).to.equal('title');
  });
};

const capitalized = (): void => {
  it('title that does not start capitalized should throw error', () => {
    const message = 'this is a title.\nfeat(new) -> added a new feature';
    const validation = validateMessage(message);

    expect(validation.valid).to.be.false;
    expect(validation.errors.length).to.equal(1);
    expect(validation.errors[0].message).to.equal(
      'Title should start with a capital letter'
    );
    expect(validation.errors[0].scope).to.equal('title');
  });
};

const period = (): void => {
  it('title that does not end with a period should throw error', () => {
    const message = 'This is a title\nfeat(new) -> added a new feature';
    const validation = validateMessage(message);

    expect(validation.valid).to.be.false;
    expect(validation.errors.length).to.equal(1);
    expect(validation.errors[0].message).to.equal(
      'Title should end with a period'
    );
    expect(validation.errors[0].scope).to.equal('title');
  });
};

describe('Validation - Titles', () => {
  shortTitle();
  longTitle();
  capitalized();
  period();
});
