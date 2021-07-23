#!/usr/bin/env node
/* eslint-disable no-console */
/* istanbul ignore file */
import { argv } from 'process';
import { validateMessage } from './validate-message';

// Find message
let message = '';

for (const argument of argv) {
  if (argument.includes('message')) {
    [, message] = argument.split('=');
  }
}

console.log(`\nValidating message:\n${message}\n`);

const validation = validateMessage(message);

// Loop over all errors
validation.errors.forEach(validationError => {
  console.log(`--- ${validationError.scope} (on line ${validationError.line})`);
  console.log(`>>> ${validationError.message}`);
  console.log(`${validationError.content}\n`);
});

process.exit(validation.valid ? 0 : 1);
