import { describe, it } from 'mocha';
import { expect } from 'chai';
import { validateMessage } from '../../src/validate/validate-message';

const correctChange = (): void => {
  it('correct change should be valid', () => {
    const validation = validateMessage(
      'This is a title.\nfeat(new) -> added a new feature'
    );

    expect(validation.valid).to.be.true;
    expect(validation.errors.length).to.equal(0);
  });
};

const noTagChange = (): void => {
  it('change with no tag should throw error', () => {
    const validation = validateMessage(
      'This is a title.\n -> this is a change'
    );

    expect(validation.valid).to.be.false;
    expect(validation.errors.length).to.equal(1);
    expect(validation.errors[0].message).to.equal('Change should have a tag');
    expect(validation.errors[0].scope).to.equal('change');
  });
};

const withoutMessage = (): void => {
  it('change without a message should throw error', () => {
    const validation = validateMessage('This is a title.\nfeat(new) -> ');

    expect(validation.valid).to.be.false;
    expect(validation.errors.length).to.equal(1);
    expect(validation.errors[0].message).to.equal(
      'Change should have a message'
    );
    expect(validation.errors[0].scope).to.equal('change');
  });
};

const incorrectTag = (): void => {
  it('incorrect tag should throw an error', () => {
    const validation = validateMessage(
      'This is a title.\ninvalid-tag -> added a new feature'
    );

    expect(validation.valid).to.be.false;
    expect(validation.errors.length).to.equal(1);
    expect(validation.errors[0].message).to.equal(
      "Tag 'invalid-tag' does not exist"
    );
    expect(validation.errors[0].scope).to.equal('change');
  });
};

const shortMessage = (): void => {
  it('change with message shorter than 8 characters should throw error', () => {
    const validation = validateMessage('This is a title.\nfeat(new) -> change');

    expect(validation.valid).to.be.false;
    expect(validation.errors.length).to.equal(1);
    expect(validation.errors[0].message).to.equal(
      'Message should be at least 8 characters'
    );
    expect(validation.errors[0].scope).to.equal('change');
  });
};

const longMessage = (): void => {
  it('change with message long than 52 characters should throw error', () => {
    const validation = validateMessage(
      'This is a title.\nfeat(new) -> change with a very long message that definitely passes 52 chars'
    );

    expect(validation.valid).to.be.false;
    expect(validation.errors.length).to.equal(1);
    expect(validation.errors[0].message).to.equal(
      'Message should be less than 52 characters'
    );
    expect(validation.errors[0].scope).to.equal('change');
  });
};

const incorrectName = (): void => {
  it('incorrect name in message should throw an error', () => {
    const validation = validateMessage(
      'This is a title.\nfeat(change) -> added support for iphone'
    );

    expect(validation.valid).to.be.false;
    expect(validation.errors.length).to.equal(1);
    expect(validation.errors[0].message).to.equal(
      "Expected 'iPhone' but found 'iphone'"
    );
    expect(validation.errors[0].scope).to.equal('change');
  });
};

const correctName = (): void => {
  it('correct name should be valid', () => {
    const validation = validateMessage(
      'This is a title.\nfeat(change) -> added support for iPhone'
    );

    expect(validation.valid).to.be.true;
    expect(validation.errors.length).to.equal(0);
  });
};

const lowercaseMessage = (): void => {
  it('non lowercase message should throw error', () => {
    const validation = validateMessage(
      'This is a title.\nfeat(change) -> This is not a lowercase Message'
    );

    expect(validation.valid).to.be.false;
    expect(validation.errors.length).to.equal(1);
    expect(validation.errors[0].message).to.equal(
      'Message should be all lowercase except for names'
    );
    expect(validation.errors[0].scope).to.equal('change');
  });
};

const endWithPeriod = (): void => {
  it('message that ends on a period should throw error', () => {
    const validation = validateMessage(
      'This is a title.\nfeat(change) -> this is a change.'
    );

    expect(validation.valid).to.be.false;
    expect(validation.errors.length).to.equal(1);
    expect(validation.errors[0].message).to.equal(
      'Message should not end with a period'
    );
    expect(validation.errors[0].scope).to.equal('change');
  });
};

describe('Validation - Changes', () => {
  correctChange();
  noTagChange();
  withoutMessage();
  incorrectTag();
  shortMessage();
  longMessage();
  incorrectName();
  correctName();
  lowercaseMessage();
  endWithPeriod();
});
