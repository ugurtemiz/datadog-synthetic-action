const core = require('@actions/core');
const httpm = require ('@actions/http-client');

function getClient(apiKey) {
  return new httpm.HttpClient('dd-http-client', [], {
    headers: {
      'DD-API-KEY': apiKey,
      'Content-Type': 'application/json'
    }
  })
}

async function run() {
  try {
    const apiKey = core.getInput('datadog-api-key');
    const apiURL = core.getInput('api-url');
    console.log(`Hello DATADOG_API_KEY ${apiKey}!`);

    const http = getClient(apiKey);

    const res = await http.get(`${apiURL}/api/v1/validate`)

    if (res.message.statusCode === undefined || res.message.statusCode >= 400) {
      throw new Error(`HTTP request failed: ${res.message.statusMessage}`)
    }

    core.setOutput("res --> ", JSON.stringify(res));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
