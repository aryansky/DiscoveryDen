const cities = require("cities.json");
const indianCities = [];
const fs = require("fs");

for (let city of cities) {
  if (city.country === "IN") {
    indianCities.push(city);
  }
}

fs.writeFile(
  "./seeds/indianCities.json",
  JSON.stringify(indianCities, null, 2),
  (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("JSON file updated successfully!");
  }
);
