const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const file = resolve(__dirname, '../..', 'action.yml');
const content = readFileSync(file, 'utf-8');
writeFileSync(
  file,
  content.replaceAll(
    'ghcr.io/onezerocompany/versioning:latest',
    `ghcr.io/onezerocompany/versioning:${process.argv[2]}`
  )
);
