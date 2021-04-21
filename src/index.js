const core = require('@actions/core');

try {
  const apiKey = core.getInput('datadog-api-key');
  console.log(`Hello DATADOG_API_KEY ${apiKey}!`);
  core.setOutput("result", "This is the result!");
} catch (error) {
  core.setFailed(error.message);
}
