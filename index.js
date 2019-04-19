#!/usr/bin/env node
const request = require('request-promise');
const argv = require('minimist')(process.argv.slice(2));
const findUp = require('find-up');
const yamlConfPath = findUp.sync('.sprintr.yml');
let yamlConf = {};

if (yamlConfPath) {
  console.log('using yaml configuration found at', yamlConfPath);
  const YAML = require('yamljs');
  yamlConf = YAML.load(yamlConfPath);
  if (argv.dry) {
    console.log('yamlConf is', yamlConf);
  }
}

const conf = yamlConf.default;
const targetConf = yamlConf.default.target.default;

request({
  method: 'POST',
  url: `https://${conf.auth.account}.atlassian.net/rest/api/3/issue`,
  headers: {
    'Authorization': 'Basic ' + Buffer.from(conf.auth.username + ':' + conf.auth.username).toString('base64')
  },
  json: {
    'fields': Object.assign(targetConf, { summary: argv.summary })
  }
}).then(result => {
  console.log(result);
});
