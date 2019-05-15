const request = require('request-promise');
const querystring = require('querystring');

class Client {
  constructor (conf) {
    if (!conf) {
      throw new Error('missing configuration');
    }
    this.conf = conf;
  }
  _headers () {
    return {
      'Authorization': 'Basic ' + Buffer.from(this.conf.auth.username + ':' + this.conf.auth.token).toString('base64'),
      'Content-Type': 'application/json'
    };
  }
  _url (url) {
    return `https://${this.conf.auth.account}.atlassian.net${url}`;
  }
  getFilter (filterId) {
    // https://myhippo.atlassian.net/rest/api/2/filter/12720
    return request({
      method: 'GET',
      url: this._url(`/rest/api/2/filter/${filterId}`),
      json: true,
      headers: this._headers()
    });
  }

  searchIssues (params) {
    return request({
      method: 'GET',
      url: this._url(`/rest/api/latest/search?${querystring.stringify(params)}`),
      json: true,
      headers: this._headers()
    });
  }

  searchFilter (filterId) {
    return this.getFilter(filterId).then(filter => {
      return this.searchIssues({ jql: filter.jql });
    });
  }

  // data = {fields}
  createIssue (data) {
    return request({
      method: 'POST',
      url: this._url(`/rest/api/3/issue`),
      headers: this._headers(),
      json: data
    });
  }
}

module.exports = Client;
