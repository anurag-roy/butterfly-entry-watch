require("dotenv").config();
const path = require("path");
const cors = require("cors");
const express = require("express");
const KiteTicker = require("kiteconnect").KiteTicker;

const app = express();
const mapperRouter = require("./mapper");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const apiKey = process.env.API_KEY;
const accessToken = process.env.ACCESS_TOKEN;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "build")));

app.use("/mapper", mapperRouter);

io.on("connection", (socket) => {
  console.log("User connected");

  const ticker = new KiteTicker({
    api_key: apiKey,
    access_token: accessToken,
  });

  ticker.on("connect", (aCEToken, aPEToken, bCEToken, bPEToken, cCEToken, cPEToken) => {
    console.log("Ticker connected. Subscribing to stocks...");
    ticker.setMode(ticker.modeFull, [aCEToken, aPEToken, bCEToken, bPEToken, cCEToken, cPEToken]);
  });

  ticker.on("close", () => {
    console.log("Disconnecting ticker gracefully...");
  });

  socket.on("startButterflyWatch", (stockTokens) => {
    // Extract instruments tokens for each stock
    const aCEToken = parseInt(stockTokens.stockACE);
    const aPEToken = parseInt(stockTokens.stockAPE);
    const bCEToken = parseInt(stockTokens.stockBCE);
    const bPEToken = parseInt(stockTokens.stockBPE);
    const cCEToken = parseInt(stockTokens.stockCCE);
    const cPEToken = parseInt(stockTokens.stockCPE);

    // Declare variables which will be updated on each tick
    // Initialize with value 0
    let [
      aCEBuyersBid,
      aCESellersBid,
      aPEBuyersBid,
      aPESellersBid,
      bCEBuyersBid,
      bCESellersBid,
      bPEBuyersBid,
      bPESellersBid,
      cCEBuyersBid,
      cCESellersBid,
      cPEBuyersBid,
      cPESellersBid,
    ] = Array(12).fill(0);

    // Group Calculations
    // groupOne = 0 + aCEBuyersBid - 2*bCESellersBid + cCEBuyersBid
    // groupTwo = 0 - aCESellersBid + 2*bCEBuyersBid - cCESellersBid
    // groupThree = 0 + aPEBuyersBid - 2*bPESellersBid + cPEBuyersBid
    // groupFour = 0 - aPESellersBid + 2*bPEBuyersBid - cPESellersBid

    // let [groupOne, groupTwo, groupThree, groupFour] = Array(4).fill(0);

    ticker.connect(aCEToken, aPEToken, bCEToken, bPEToken, cCEToken, cPEToken);

    socket.emit("groupOne", 0 + aCEBuyersBid - 2 * bCESellersBid + cCEBuyersBid);
    socket.emit("groupTwo", 0 - aCESellersBid + 2 * bCEBuyersBid - cCESellersBid);
    socket.emit("groupThree", 0 + aPEBuyersBid - 2 * bPESellersBid + cPEBuyersBid);
    socket.emit("groupFour", 0 - aPESellersBid + 2 * bPEBuyersBid - cPESellersBid);

    ticker.on("ticks", (ticks) => {
      ticks.forEach((t) => {
        if (t.instrument_token == aCEToken) {
          if (t.depth) {
            if (t.depth.buy) {
              aCEBuyersBid = t.depth.buy[1].price;
              socket.emit("groupOne", 0 + aCEBuyersBid - 2 * bCESellersBid + cCEBuyersBid);
            }
            if (t.depth.sell) {
              aCESellersBid = t.depth.sell[1].price;
              socket.emit("groupTwo", 0 - aCESellersBid + 2 * bCEBuyersBid - cCESellersBid);
            }
          }
        } else if (t.instrument_token == aPEToken) {
          if (t.depth) {
            if (t.depth.buy) {
              aPEBuyersBid = t.depth.buy[1].price;
              socket.emit("groupThree", 0 + aPEBuyersBid - 2 * bPESellersBid + cPEBuyersBid);
            }
            if (t.depth.sell) {
              aPESellersBid = t.depth.sell[1].price;
              socket.emit("groupFour", 0 - aPESellersBid + 2 * bPEBuyersBid - cPESellersBid);
            }
          }
        } else if (t.instrument_token == bCEToken) {
          if (t.depth) {
            if (t.depth.buy) {
              bCEBuyersBid = t.depth.buy[1].price;
              socket.emit("groupTwo", 0 - aCESellersBid + 2 * bCEBuyersBid - cCESellersBid);
            }
            if (t.depth.sell) {
              bCESellersBid = t.depth.sell[1].price;
              socket.emit("groupOne", 0 + aCEBuyersBid - 2 * bCESellersBid + cCEBuyersBid);
            }
          }
        } else if (t.instrument_token == bPEToken) {
          if (t.depth) {
            if (t.depth.buy) {
              bPEBuyersBid = t.depth.buy[1].price;
              socket.emit("groupFour", 0 - aPESellersBid + 2 * bPEBuyersBid - cPESellersBid);
            }
            if (t.depth.sell) {
              bPESellersBid = t.depth.sell[1].price;
              socket.emit("groupThree", 0 + aPEBuyersBid - 2 * bPESellersBid + cPEBuyersBid);
            }
          }
        } else if (t.instrument_token == cCEToken) {
          if (t.depth) {
            if (t.depth.buy) {
              cCEBuyersBid = t.depth.buy[1].price;
              socket.emit("groupOne", 0 + aCEBuyersBid - 2 * bCESellersBid + cCEBuyersBid);
            }
            if (t.depth.sell) {
              cCESellersBid = t.depth.sell[1].price;
              socket.emit("groupTwo", 0 - aCESellersBid + 2 * bCEBuyersBid - cCESellersBid);
            }
          }
        } else if (t.instrument_token == cPEToken) {
          if (t.depth) {
            if (t.depth.buy) {
              cPEBuyersBid = t.depth.buy[1].price;
              socket.emit("groupThree", 0 + aPEBuyersBid - 2 * bPESellersBid + cPEBuyersBid);
            }
            if (t.depth.sell) {
              cPESellersBid = t.depth.sell[1].price;
              socket.emit("groupFour", 0 - aPESellersBid + 2 * bPEBuyersBid - cPESellersBid);
            }
          }
        }
      });
    });
  });

  socket.on("disconnect", () => {
    ticker.disconnect();
    console.log("Client disconnected");
  });
});

http.listen(3001, () => {
  console.log("Butterfly Entry Watch started on http://localhost:3001");
});
