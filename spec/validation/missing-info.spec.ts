import { describe, it } from 'mocha';
import { expect } from 'chai';
import { validateMessage } from '../../src/validate/validate-message';

describe('Validation - Missing Information', () => {
  it('should not validate a message with no content', () => {
    expect(validateMessage('').valid).to.be.false;
  });
  it('commit without changes should throw error', () => {
    const validation = validateMessage('This is a title.');

    expect(validation.valid).to.be.false;
    expect(validation.errors.length).to.equal(1);
    expect(validation.errors[0].message).to.equal(
      'Commit message should have at least one change'
    );
    expect(validation.errors[0].scope).to.equal('change');
  });
  it('missing tag should throw an error', () => {
    const validation = validateMessage(
      'This is a title.\n -> this is a change'
    );

    expect(validation.valid).to.be.false;
    expect(validation.errors.length).to.equal(1);
    expect(validation.errors[0].message).to.equal('Change should have a tag');
    expect(validation.errors[0].scope).to.equal('change');
  });
});
