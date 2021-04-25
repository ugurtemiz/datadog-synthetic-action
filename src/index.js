const core = require("@actions/core");
const httpm = require("@actions/http-client");

function getClient(apiKey, applicationKey) {
  const header = {
    headers: {
      "DD-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
  };

  if (applicationKey) {
    header.headers["DD-APPLICATION-KEY"] = applicationKey;
  }

  return new httpm.HttpClient("dd-http-client", [], header);
}

async function run() {
  try {
    const apiKey = core.getInput("datadog-api-key");
    const applicationKey = core.getInput("datadog-application-key");
    const apiURL = core.getInput("api-url");
    const publicIDs = core.getInput("public-ids").split(",");
    console.log(`Hello publicIDs ${publicIDs}!`);

    const http = getClient(apiKey, applicationKey);

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
