// this file will use CRLF as EOL character
// this file will auto convert double string to single string

// (extended rule)
/* eslint-disable @typescript-eslint/no-unused-vars */
const a = 5;

// (extended rule)
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
1 + 2;

// extended rule
/* eslint-disable import/first */

/* eslint-disable sort-imports */
/* eslint-disable import/order */
import { safeRedirect } from '~/utils';
import { createRequestHandler } from '@remix-run/express';
import type { ServerBuild, SerializeFrom } from '@remix-run/node';

/* eslint-disable quotes */
console.log(`single quote string`);

/* eslint-disable @typescript-eslint/no-unnecessary-condition */
const myNum: number = 1;

if (myNum !== undefined) {
  console.log('true');
}

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
if (myNum) {
  console.log('true');
}

/* eslint-disable curly */
if (myNum === 0) console.log('true');

/* eslint-disable eqeqeq */
if (myNum == 0) {
  console.log('true');
}
