import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { Card } from "antd";

import "./ButterflyWatch.css";

const ENDPOINT = "http://127.0.0.1:3001";

const WatchCards = ({ groupNumber, stocks, instrumentType, transactionTypes, value }) => {
  const nameStyle = {
    width: "50%",
    textAlign: "center",
  };

  const contentStyle = {
    width: "25%",
    textAlign: "center",
  };

  const valueStyle = {
    width: "100%",
    textAlign: "center",
  };

  return (
    <Card
      title={`Group ${groupNumber}`}
      extra={<a href="#">Order</a>}
      style={{ width: "30%", margin: "2rem" }}
    >
      <Card.Grid hoverable={false} style={nameStyle}>
        {stocks.stockA.name}
      </Card.Grid>
      <Card.Grid hoverable={false} style={contentStyle}>
        {instrumentType}
      </Card.Grid>
      <Card.Grid hoverable={false} style={contentStyle}>
        {transactionTypes[0]}
      </Card.Grid>
      <Card.Grid hoverable={false} style={nameStyle}>
        {stocks.stockB.name}
      </Card.Grid>
      <Card.Grid hoverable={false} style={contentStyle}>
        {instrumentType}
      </Card.Grid>
      <Card.Grid hoverable={false} style={contentStyle}>
        {transactionTypes[1]}
      </Card.Grid>
      <Card.Grid hoverable={false} style={nameStyle}>
        {stocks.stockC.name}
      </Card.Grid>
      <Card.Grid hoverable={false} style={contentStyle}>
        {instrumentType}
      </Card.Grid>
      <Card.Grid hoverable={false} style={contentStyle}>
        {transactionTypes[2]}
      </Card.Grid>
      <Card.Grid hoverable={false} style={valueStyle}>
        {value}
      </Card.Grid>
    </Card>
  );
};

export const ButterflyWatch = ({ stockA, stockB, stockC }) => {
  const stockNames = [stockA.name, stockB.name, stockC.name];

  const [groupOneValue, setGroupOneValue] = useState(0);
  const [groupTwoValue, setGroupTwoValue] = useState(0);
  const [groupThreeValue, setGroupThreeValue] = useState(0);
  const [groupFourValue, setGroupFourValue] = useState(0);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.emit("startButterflyWatch", {
      stockACE: stockA.ceToken,
      stockAPE: stockA.peToken,
      stockBCE: stockB.ceToken,
      stockBPE: stockB.peToken,
      stockCCE: stockC.ceToken,
      stockCPE: stockC.peToken,
    });

    socket.on("groupOne", (value) => {
      setGroupOneValue(value);
    });

    socket.on("groupTwo", (value) => {
      setGroupTwoValue(value);
    });

    socket.on("groupThree", (value) => {
      setGroupThreeValue(value);
    });

    socket.on("groupFour", (value) => {
      setGroupFourValue(value);
    });
  }, []);

  return (
    <div className="card_container">
      <WatchCards
        groupNumber="1"
        stocks={stockNames}
        instrumentType="CE"
        transactionTypes={["SELL", "BUY", "SELL"]}
        value={groupOneValue}
      />
      <WatchCards
        groupNumber="2"
        stocks={stockNames}
        instrumentType="CE"
        transactionTypes={["BUY", "SELL", "BUY"]}
        value={groupTwoValue}
      />
      <WatchCards
        groupNumber="3"
        stocks={stockNames}
        instrumentType="PE"
        transactionTypes={["SELL", "BUY", "SELL"]}
        value={groupThreeValue}
      />
      <WatchCards
        groupNumber="4"
        stocks={stockNames}
        instrumentType="PE"
        transactionTypes={["BUY", "SELL", "BUY"]}
        value={groupFourValue}
      />
    </div>
  );
};
