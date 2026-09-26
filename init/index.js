const path = require("path");

if(process.env.NODE_ENV !== "production") {
  require('dotenv').config({path: path.join(__dirname, "../.env")});
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
  await Listing.deleteMany({});
  const updatedData = await Promise.all(
    initData.data.map(async (obj) => {
      let response = await geocodingClient
      .forwardGeocode({
        query: obj.location,
        limit: 1,
      })
      .send();
      let coordinates = response.body.features.length ? response.body.features[0].geometry.coordinates: [77.2090, 28.6139];
      return {...obj, 
        owner: '6aae7fd4bdec2439d325e0fd', 
        geometry: {
          type: "Point",
          coordinates: coordinates,
        },
      }
    })
  )
  await Listing.insertMany(updatedData);
  console.log("data was initialized");
}catch(err) {
  console.error(error);
}
}

initDB();