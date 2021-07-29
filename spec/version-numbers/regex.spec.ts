import { describe, it } from 'mocha';
import { expect } from 'chai';
import { VersionNumber } from '../../src/version-number';

describe('Number Templates to Regexes', () => {
  it('standard template to regex', () => {
    expect(
      VersionNumber.convertTemplateToRegex(
        '<<VERSION_STRING>>-<<TRACK>>/#<<BUILD>>'
      ).toString()
    ).to.equal(
      '/(?<version>\\d+.\\d+.\\d+)-(?<track>\\w+)\\/#(?<build>\\d+)/u'
    );
  });
});
