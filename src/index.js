const core = require('@actions/core');
const github = require('@actions/github');
const kewords = ['close(?:s|d)?', 'fix(?:e(?:s|d))?', 'resolve(?:s|d)?'];

const { Octokit } = require("@octokit/rest");

async function run() {
	const repository = github.context.repo;
	const token = core.getInput("token");
	const per_page = core.getInput("max_commits");
	const issues = [];

	var octokit = new Octokit({
		auth: `token ${token}`,
		userAgent: "TheBusyBiscuit/recently-closed-issues"
	});

	console.log(`Retrieving the last ${per_page} commits...`);

	var commits = await octokit.repos.listCommits({
		owner: repository.owner,
		repo: repository.repo,
		per_page: per_page
	});
	
	console.log(commits);

	for (let i in commits) {
		let message = commits[i].commit.message;

		for (let k in keywords) {
			let regexp = new RegExp(keywords[k] + ' #([0-9]+)');
			let match = regexp.exec(message);

			while (match != null) {
				var number = parseInt(match[1], 10);

				if (!(issues.includes(number))) {
					issues.push(number);
				}

				console.log(`Found closed issue #${number}`);

				match = regexp.exec(message);
			}
		}
	}

	core.setOutput("issues", issues);
}

try {
	run();
} catch (error) {
    core.setFailed(error.message);
}
