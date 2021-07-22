import { validateTag } from '../categories/categories';
import { tagRegex } from '../commit';
import { lowercaseNames, validateNames } from './names';

export enum ValidationErrorScope {
  title = 'title',
  change = 'change',
}

export interface ValidationError {
  line: number;
  content: string;
  message: string;
  scope: string;
}

const validateTitle = (title: string): ValidationError[] => {
  const errors: string[] = [];
  const minTitleLength = 10;
  const maxTitleLength = 68;

  // Title should be at least 10 characters
  if (title.length < minTitleLength)
    errors.push(`Title should be at least ${minTitleLength} characters`);

  // Title should be less than 68 characters
  if (title.length > maxTitleLength)
    errors.push(`Title should be less than ${maxTitleLength} characters`);

  // Title should start capitalized
  if (!title.startsWith(title.substring(0, 1).toUpperCase()))
    errors.push('Title should start with a capital letter');

  // Title should end with a period
  if (!title.endsWith('.')) errors.push('Title should end with a period');

  return errors.map(titleError => ({
    line: 0,
    content: title,
    message: titleError,
    scope: ValidationErrorScope.title,
  }));
};

// Verify message is more than or equal to 8 characters
const verifyMinimumMessageLength = (
  message: string,
  errors: string[]
): void => {
  const minMessageLength = 8;

  if (message.length < minMessageLength) {
    errors.push(`Message should be at least ${minMessageLength} characters`);
  }
};

// Verify message is less than or equal to 52 characters
const verifyMaximumMessageLength = (
  message: string,
  errors: string[]
): void => {
  const maxMessageLength = 52;

  if (message.length > maxMessageLength) {
    errors.push(`Message should be less than ${maxMessageLength} characters`);
  }
};

// Verify names in message are valid
const verifyNamesAreValid = (message: string, errors: string[]): void => {
  const nameErrors = validateNames(message);

  if (nameErrors.length > 0) {
    errors.push(...nameErrors);
  }
};

// Verify message is all lowercase
const verifyLowercaseMessage = (message: string, errors: string[]): void => {
  if (message !== message.toLowerCase()) {
    errors.push('Message should be all lowercase except for names');
  }
};

const verifyMessagePeriod = (message: string, errors: string[]): void => {
  if (message.endsWith('.')) {
    errors.push('Message should not end with a period');
  }
};

const convertChangeErrors = (
  line: number,
  content: string,
  errors: string[]
): ValidationError[] =>
  errors.map(changeError => ({
    line,
    content,
    message: changeError,
    scope: ValidationErrorScope.change,
  }));

const validateChange = (line: number, content: string): ValidationError[] => {
  const errors: string[] = [];
  const { tag, message } = (tagRegex.exec(content)?.groups ?? {}) as {
    tag: string | undefined;
    message: string | undefined;
  };

  if (typeof tag === 'undefined' || tag.trim().length < 1)
    errors.push('Change should have a tag');
  else if (typeof message === 'undefined' || message.trim().length < 1)
    errors.push('Change should have a message');
  else {
    if (!validateTag(tag)) {
      errors.push(`Tag '${tag}' does not exist`);
    }

    const sanitizedMessages = message?.trim() ?? '';

    verifyMinimumMessageLength(sanitizedMessages, errors);
    verifyMaximumMessageLength(sanitizedMessages, errors);
    verifyNamesAreValid(sanitizedMessages, errors);
    verifyLowercaseMessage(lowercaseNames(sanitizedMessages), errors);
    verifyMessagePeriod(sanitizedMessages, errors);
  }

  return convertChangeErrors(line, content, errors);
};

// Validate a commit message
export const validateMessage = (
  message: string
): { valid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];
  const lines = message
    .split('\\n')
    .flatMap(line => line.split('\\r'))
    .flatMap(line => line.split('\n'))
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // Should have at least one change
  if (lines.length <= 1) {
    errors.push({
      line: 0,
      content: message,
      message: 'Commit message should have at least one change',
      scope: ValidationErrorScope.change,
    });
  }

  // Enumerated over lines
  lines.forEach((line, index) => {
    if (index === 0) errors.push(...validateTitle(line));
    else errors.push(...validateChange(index, line));
  });

  return { valid: errors.length === 0, errors };
};
