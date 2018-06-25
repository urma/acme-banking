'use strict';

const child_process = require('child_process');
const crypto = require('crypto');
const path = require('path');
const winston = require('winston');

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({ colorize: true, timestamp: true }),
  ],
});

/* Check for Jenkins environment variables */
if (!process.env.hasOwnProperty('BUILD_TAG')) {
  logger.error('This script is meant to be executed from within a Jenkins build plan');
  logger.error('If you know what you are doing, please populate the required environment');
  logger.error('variables and run it again');
  process.exit(1);
}

const stackId = process.env.BUILD_TAG;
const deployStatus = child_process.spawnSync('docker', [ 'stack', 'deploy', stackId, '--compose-file',
  path.join(__dirname, '../docker-compose-jenkins.yml') ]);
