# Sprintr
> Open ticket to represent your sprint status from terminal.    
> Keep focus on your IDE.   
> Avoid going to browser.

# Usage

```bash
npm install -g sprintr
sprint --summary "do this task"

>> { id: '25767',
  key: 'ABC-10566',
  self: 'https://myaccount.atlassian.net/rest/api/3/issue/11111111' }
```

# Conf file

Example configuration file

```yaml
default:
  type: jira // only cloud jira currently supported
  auth:
    token: __token__ // generate at https://id.atlassian.com/manage-profile/security
    username: __user__
    account: __account__ // subdomain
  target:
    default: // only default currently supported
      project:
        key: __key__ // project key
      issuetype:
        name: __issuetype__ // Bug, Task etc..
      customfield_11243:  // qa Assignee
        name: __username__
      customfield_10300: __number__ // story points
      customfield_10400: // component
        value: __dropdown_value__
      customfield_10104: __some_custom_value__ // Team
      assignee:
        name: __username__
```
