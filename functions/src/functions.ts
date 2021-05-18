import * as functions from 'firebase-functions'
import { categories } from './change-categories';

export const generateVersion = functions.region('eur3').https.onRequest((request, response) => {
  if (request.get('content-type') == 'application/json') {
    // let { commits } = request.body
    response.json({})
  } else {
    response.status(400).json({ error: 'body of request is not application/json' })
  }
})

export const verifyMessage = functions.region('eur3').https.onRequest((request, response) => {
  if (request.get('content-type') == 'application/json') {
    const tags = categories.flatMap( category => category.keys.map(key => `[${key}]>`) )
    let { title, message } = request.body
    var errors = []
    if (tags.map(tag => title.includes(tag)).includes(true)) {
      errors.push('title contains changelog tags')
    }
    if (message.split('\n').map((line: string) => 
      tags.map(tag => line.includes(tag)).includes(true)
    ).includes(false)) {
      errors.push('some lines in the message are missing changelog tags')
    }
    if (errors.length > 0) {
      response.status(400).json({ title, message, errors, valid: false })
    } else {
      response.status(200).json({ title, message, valid: true })
    }
  } else {
    response.status(400).json({ error: 'body of request is not application/json' })
  }
})