/* eslint no-console: 0 */
'use strict';

const child_process = require('child_process');
const fs = require('fs');
const util = require('util');

// eslint-disable-next-line security/detect-non-literal-fs-filename
const promiseReadFile = util.promisify(fs.readFile);
const promiseExecFile = util.promisify(child_process.execFile);

const execOptions = {
  maxBuffer: 4194304, /* maximum 4M of output buffered */
  encoding: 'utf8'    /* assume output is utf8-encoded */
};

function filteredEntry(entry, whitelist) {
  return Object.assign({}, entry, {
    stringsFound: entry.stringsFound.filter(string => !whitelist[entry.path] || !whitelist[entry.path].includes(string))
  });
}

/* Read the whitelist; if we cannot do it, do not assume anything and have the user create an empty file */
promiseReadFile('.trufflehog_whitelist.json').then((data) => {
  const whitelist = JSON.parse(data);

  /**
   * Run Trufflehog in JSON output format and filter results against whitelist; note that we parse and filter
   * the output even during error conditions -- because Trufflehog exits with a non-zero return code when it
   * finds high entropy strings, child_process will raise an error but the output is still parseable
   */
  promiseExecFile('/usr/bin/env', [ 'trufflehog', '.', '--json' ], execOptions).then((stdout) => {
    stdout.split(/\n+/).filter(row => row.length > 0).map(row => filteredEntry(JSON.parse(row), whitelist))
      .filter(entry => entry.stringsFound.length > 0).forEach((entry) => {
        console.log(JSON.stringify(entry));
      });
  }).catch((err) => {
    /* Check exit code; if we got triggered because of a non-zero exit code, parse output anyway */
    if (err.code !== 0) {
      err.stdout.split(/\n+/).filter(row => row.length > 0).map(row => filteredEntry(JSON.parse(row), whitelist))
        .filter(entry => entry.stringsFound.length > 0).forEach((entry) => {
          console.log(JSON.stringify(entry));
        });
    }
  });
}).catch(() => {
  console.error('Trufflehog whitelist is not initialised; please create an empty .trufflehog_whitelist.json file');
  process.exit(1);
});
