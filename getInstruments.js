require("dotenv").config();
const fs = require("fs");
const KiteConnect = require("kiteconnect").KiteConnect;

const apiKey = process.env.API_KEY;
const accessToken = process.env.ACCESS_TOKEN;

const kc = new KiteConnect({
  api_key: apiKey,
});

kc.setAccessToken(accessToken);

(async () => {
  try {
    const instruments = await kc.getInstruments();
    const filteredInstruments = instruments.filter(
      (i) => i.exchange === "NFO" || i.exchange === "MCX",
    );
    fs.writeFileSync("instruments.json", JSON.stringify(filteredInstruments), (error) => {
      if (error) console.log("Error while writing instruments", error);
    });
  } catch (error) {
    console.log("Some error occurred: ", error);
  }
})();
