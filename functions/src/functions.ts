import * as functions from 'firebase-functions';
import {categories} from './change-categories';
import {Version, VersionInput} from './version-item';

const https = functions.region('eur3').https;

/**
 * Cloud Function that generates a version.json for a release
 */
export const generateVersion = https.onRequest((request, response) => {

  if (request.get('content-type') == 'application/json') {

    const input: VersionInput = request.body;
    response.json(new Version(input));

  } else {

    response.status(400)
      .json({error: 'body of request is not application/json'});

  }

});

/**
 * Cloud Function that verifies a commit title and message
 */
export const verifyMessage = https.onRequest((request, response) => {

  if (request.get('content-type') == 'application/json') {

    const tags = categories
      .flatMap((category) => category.keys.map((key) => `[${key}]>`));
    const {title, message} = request.body;
    const errors = [];
    if (tags.map((tag) => title.includes(tag)).includes(true)) {

      errors.push('title contains changelog tags');

    }
    if (message.split('\n').map((line: string) =>
      tags.map((tag) => line.includes(tag)).includes(true)
    ).includes(false)) {

      errors.push('some lines in the message are missing changelog tags');

    }
    if (errors.length > 0) {

      response.status(400).json({title, message, errors, valid: false});

    } else {

      response.status(200).json({title, message, valid: true});

    }

  } else {

    response.status(400)
      .json({error: 'body of request is not application/json'});

  }

});
