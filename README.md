# GitHub Action: Retrieve issues that were recently closed by a commit
This simple Action provides you a way to retrieve issues that were recently closed via a commit.<br>
The GitHub API currently does not allow us to retrieve that information in any easily accessible way, hence why I made this Action myself.

This can be very useful if you want to assign labels to closed tickets for example.

## Inputs

### `token`
**Required** The token is just a standard Access Token from GitHub, this is used for authentication.<br>
You can use the built-in ${{ secrets.GITHUB_TOKEN }} variable for this.

### `max_commits`
**Required** This parameter determines how many commits should be retrieved. The maximal value for this is 100.

## Outputs

### `issues`
The output of this is a JSON Array of numbers, corresponding to the issue numbers that were closed via commits.

## Example usages

### Print out recently closed tickets

```yaml
on:
  issue:
    types:
      - closed

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: TheBusyBiscuit/recently-closed-issues@master
        id: my_step_id
        token: ${{ secrets.GITHUB_TOKEN }}
        max_commits: 20
      - run: echo $ {{ steps.my_step_id.outputs.issues }}
```

### Assign a label to an issue if it was closed by a ticket
This example will add a "Resolved" label to any issue that was closed via a commit.<br>
I am using the GitHub Action [maxkomarychev/octions@master](https://github.com/maxkomarychev/octions) to add the label, any action that can add labels will suffice though, this is just an example.

You can use GitHub's [expressions syntax](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#contains) to create a simple if-statement that will make a step only trigger if the currently closed issue was closed via a commit.

```yaml
on:
  issue:
    types:
      - closed

jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: TheBusyBiscuit/recently-closed-issues@master
        id: my_step_id
        token: ${{ secrets.GITHUB_TOKEN }}
        max_commits: 20
      - uses: maxkomarychev/octions/octions/issues/add-labels@master
        if: contains(toJson(steps.resolved.outputs.issues), github.event.issue.number)
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          issue_number: ${{ github.event.issue.number }}
          labels: 'Resolved'
```
