import * as functions from 'firebase-functions';
import { categories } from './change-categories';
import { Version, VersionInput } from './version-item';

const https = functions.region('eur3').https;

/**
 * Cloud Function that generates a version.json for a release
 */
export const generateVersion = https.onRequest((request, response) => {
  if ((request.get('content-type')?.indexOf('application/json') ?? -1) > -1) {
    const input: VersionInput = request.body;
    response.json(new Version(input));
  } else {
    response.status(400)
      .json({ error: 'body of request is not application/json' });
  }
});

/**
 * Cloud Function that verifies a commit title and message
 */
export const verifyMessage = https.onRequest((request, response) => {
  if ((request.get('content-type')?.indexOf('application/json') ?? -1) > -1) {
    const errors = [];
    const { title, message } = request.body;
    if (message == undefined) errors.push('missing message body');
    if (title == undefined) errors.push('missing title');
    if (errors.length == 0) {
      const tags = categories
        .flatMap((category) => category.keys.map((key) => `[${key}]>`));
      if (tags.map((tag) => title.includes(tag)).includes(true)) {
        errors.push('title contains changelog tags');
      }
      if (message.split('\n').map((line: string) =>
        tags.map((tag) => line.includes(tag)).includes(true)
      ).includes(false)) {
        errors.push('some lines in the message are missing changelog tags');
      }
    }
    if (errors.length > 0) {
      response.status(400).json({ title, message, errors, valid: false });
    } else {
      response.status(200).json({ title, message, valid: true });
    }
  } else {
    response.status(400)
      .json({ error: 'body of request is not application/json' });
  }
});
