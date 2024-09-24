const fs = require("fs");

// NOTE: Add release versions here for all the JSON data
// that is available in `asrouter-local-prod-messages`
let availableReleases = [130, 129, 128, 127, 126, 125, 124, 123];

// Sort availableReleases in descending order
// XXX This will need to be revisited if/once we add dot-versions
availableReleases.sort(function (a, b) {
  return b - a;
});
console.log(availableReleases);

// Overwriting data.json to ensure we get the latest released version data first
fs.writeFileSync(
  "lib/asrouter-local-prod-messages/data.json",
  JSON.stringify([]),
);

/**
 * Takes all message data for releases in `availableReleases` from
 * lib/asrouter-local-prod-messages and merges all message objects into
 * `data.json`. For any duplicate messages (ie. messages with the same id),
 * we keep the message from the latest release.
 */
function mergeReleases() {
  availableReleases.map((release) => {
    // Existing message data
    let result = fs.readFileSync(
      "lib/asrouter-local-prod-messages/data.json",
      "utf8",
    );
    let json_result = JSON.parse(result);

    // Release message data
    let data = fs.readFileSync(
      `lib/asrouter-local-prod-messages/${release.toString()}-release.json`,
      "utf8",
    );
    let json_data = JSON.parse(data);

    // Add any message data with an id that does not already exist in data.json
    for (let i = 0; i < json_data.length; i++) {
      if (!json_result.find((x) => x.id === json_data[i].id)) {
        json_result.push(json_data[i]);
      }
    }

    fs.writeFileSync(
      "lib/asrouter-local-prod-messages/data.json",
      JSON.stringify(json_result),
    );
  });
}

mergeReleases();
