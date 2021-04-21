const core = require('@actions/core');

try {
  // `who-to-greet` input defined in action metadata file
  const apiKey = core.getInput('datadog-api-key');
  console.log(`Hello ${apiKey}!`);
  core.setOutput("result", "This is the result!");
} catch (error) {
  core.setFailed(error.message);
}
