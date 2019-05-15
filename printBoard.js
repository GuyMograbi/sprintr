const wrap = require('word-wrap');
const chalk = require('chalk');
const _ = require('lodash');

var Table = require('cli-table');

const colorType = (type) => {
  return {
    Enhancement: chalk.green(type),
    Bug: chalk.red(type),
    Feature: chalk.green(type),
    Story: chalk.green(type),
    Task: chalk.cyan(type),
    Test: chalk.magenta(type)
  }[type] || type;
};

function pickFields (account, issue) {
  const result = {
    key: issue.key,
    link: `https://${account}.atlassian.net/browse/${issue.key}`,
    type: issue.fields.issuetype.name,
    status: issue.fields.status.name,
    summary: issue.fields.summary,
    assignee: issue.fields.assignee ? issue.fields.assignee.displayName : 'unassigned'
  };

  result.display = [
    result.summary + '\n ----------',
    colorType(result.type) + '   ' + result.assignee,
    result.link
  ].map((s) => wrap(s, { width: 60 })).join('\n');

  return result;
}

exports.print = (conf, issues) => {
  const account = conf.auth.account;
  const columns = conf.columns;
  issues = issues.map((issue) => pickFields(account, issue));
  issues = _.groupBy(issues, 'status');

  const headers = columns.map(c => c.label);
  const rows = [];
  let count = 0;
  while (!_.isEmpty(issues)) {
    count++;
    if (count > 100) {
      process.exit(0);
    }
    const row = [];
    _.each(columns, c => {
      const status = _.find(c.statuses, status => {
        return !_.isEmpty(issues[status]);
      });
      if (status) {
        const items = issues[status];
        row.push(_.first(items).display);
        items.splice(0, 1); // assume first was selected
        if (_.isEmpty(items)) {
          delete issues[status];
        }
      } else {
        row.push('');
      }
    });
    rows.push(row);
  }

  // instantiate
  var table = new Table({
    head: headers
  });

  // table is an Array, so you can `push`, `unshift`, `splice` and friends
  table.push(...rows);

  console.log(table.toString());
};
