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

const stackId = crypto.randomBytes(16).toString('hex');
const dockerStackDeployCommand = [ 'stack', 'deploy', stackId, '--compose-file',
  path.join(__dirname, '../docker-compose-jenkins.yml') ];
const dockerPsCommand = [ 'ps', '--format', '{{ json . }}', '--filter', 'ancestor=owasp/zap2docker-stable:latest' ];

logger.info('Starting application stack');
child_process.execFile('/usr/local/bin/docker', dockerStackDeployCommand, (err) => {
  if (err) {
    logger.error('Error while initialising stack', err);
    process.exit(1);
  }

  logger.info('Obtaining OWASP ZAP docker container ID');
  child_process.execFile('/usr/local/bin/docker', dockerPsCommand, (err, stdout) => {
    if (err) {
      logger.error('Error while obtaining OWASP ZAP container ID', err);
      process.exit(1);
    }

    const zapContainer = JSON.parse(stdout.toString('utf8'));
    const dockerExecCommand = [ 'exec', zapContainer.ID, 'zap-full-scan.py', '-t', 'http://webapp:3000/' ];

    logger.info('Running OWASP ZAP scan against web application');
    child_process.execFile('/usr/local/bin/docker', dockerExecCommand, (err, stdout, stderr) => {
      logger.info('stdout:', stdout.toString('utf8'));
      logger.info('stderr:', stderr.toString('utf8'));
      child_process.execFile('/usr/local/bin/docker', [ 'stack', 'rm', stackId ], () => {
        logger.info('Shutting down stack');
      });
    });
  });
});