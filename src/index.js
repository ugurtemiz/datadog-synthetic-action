const core = require("@actions/core");
const httpm = require("@actions/http-client");

function getClient(apiKey) {
  console.log(`getClient`);
  return new httpm.HttpClient("dd-http-client", [], {
    headers: {
      "DD-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
  });
}

async function run() {
  try {
    const apiKey = core.getInput("datadog-api-key");
    const apiURL = core.getInput("api-url");
    const publicIDs = JSON.parse(core.getInput("public-ids"));
    console.log(`Hello publicIDs ${core.getInput("public-ids")}!`);

    const http = getClient(apiKey);

    for (const id of publicIDs) {
      const res = await http.put(
        `${apiURL}/api/v1/synthetics/tests/${id}/status`,
        '{"new_status": "paused"}'
      );
      console.log(res);
      if (
        res.message.statusCode === undefined ||
        res.message.statusCode >= 400
      ) {
        throw new Error(`HTTP request failed: ${res.message.statusMessage}`);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
