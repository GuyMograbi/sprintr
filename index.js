#!/usr/bin/env node
const Client = require('./client');
const argv = require('minimist')(process.argv.slice(2));
const findUp = require('find-up');
const yamlConfPath = findUp.sync('.sprintr.yml');
const printBoard = require('./printBoard');
let yamlConf = {};

if (yamlConfPath) {
  console.log('using yaml configuration found at', yamlConfPath);
  const YAML = require('yamljs');
  yamlConf = YAML.load(yamlConfPath);
  if (argv.verbose) {
    console.log('yamlConf is', JSON.stringify(yamlConf, {}, 2));
  }
}

const conf = yamlConf.default;
const targetConf = yamlConf.default.target.default;
const client = new Client(conf);

if (argv._[0] && conf.filters.hasOwnProperty(argv._[0])) {
  const filterId = conf.filters[argv._[0]];
  client.searchFilter(filterId).then(result => {
    printBoard.print(conf, result.issues);
  }).finally(() => {
    process.exit(0);
  });
} else {
  client.createIssue({
    'fields': Object.assign(targetConf, { summary: argv.summary })
  }).then(result => {
    console.log(result);
  });
}
