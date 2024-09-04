const fs = require("fs");

// NOTE: Add release versions here in descending order for all the JSON data 
// that is available in `asrouter-local-prod-messages`
const availableReleases = ["129", "128", "127", "126", "125", "124"]; 

availableReleases.map((release) => {
  // Existing message data
  let result = fs.readFileSync(
    "lib/asrouter-local-prod-messages/data.json",
    "utf8",
  );
  let json_result = JSON.parse(result);

  // Release message data
  let data = fs.readFileSync(
    `lib/asrouter-local-prod-messages/${release}-release.json`,
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
