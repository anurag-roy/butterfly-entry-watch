import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { Typography } from "antd";
import { Card } from "antd";

import "./ButterflyWatch.css";

const { Title } = Typography;
const ENDPOINT = "http://127.0.0.1:3001";

const WatchCards = ({ stockNames, instrumentType, transactionTypes, value }) => {
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
    fontSize: "3em",
  };

  const Image = () => {
    if (transactionTypes[0] === "SELL") {
      return (
        <>
          <img
            src="/SBS.svg"
            height="50px"
            width="50px"
            color="black"
            style={{ marginRight: "10rem" }}
          />
        </>
      );
    } else if (transactionTypes[0] === "BUY") {
      return (
        <>
          <img
            src="/BSB.svg"
            height="50px"
            width="50px"
            color="black"
            style={{ marginRight: "10rem" }}
          />
        </>
      );
    }
  };

  const [max, setMax] = useState(value);
  const [min, setMin] = useState(value);

  useEffect(() => {
    if (value > max) {
      setMax(value);
    }

    if (value < min) {
      setMin(value);
    }
  }, [value]);

  return (
    <Card
      extra={
        <>
          <Image />
          <a href="#">Order</a>
        </>
      }
      style={{ width: "30%", margin: "2rem 4rem" }}
    >
      <Card.Grid
        hoverable={false}
        style={nameStyle}
        className={transactionTypes[0] === "SELL" ? "negativeValue" : "normalValue"}
      >
        {stockNames[0]}
      </Card.Grid>
      <Card.Grid
        hoverable={false}
        style={contentStyle}
        className={transactionTypes[0] === "SELL" ? "negativeValue" : "normalValue"}
      >
        {instrumentType}
      </Card.Grid>
      <Card.Grid
        hoverable={false}
        style={contentStyle}
        className={transactionTypes[0] === "SELL" ? "negativeValue" : "normalValue"}
      >
        {transactionTypes[0]}
      </Card.Grid>
      <Card.Grid
        hoverable={false}
        style={nameStyle}
        className={transactionTypes[1] === "SELL" ? "negativeValue" : "normalValue"}
      >
        {stockNames[1]}
      </Card.Grid>
      <Card.Grid
        hoverable={false}
        style={contentStyle}
        className={transactionTypes[1] === "SELL" ? "negativeValue" : "normalValue"}
      >
        {instrumentType}
      </Card.Grid>
      <Card.Grid
        hoverable={false}
        style={contentStyle}
        className={transactionTypes[1] === "SELL" ? "negativeValue" : "normalValue"}
      >
        {transactionTypes[1]}
      </Card.Grid>
      <Card.Grid
        hoverable={false}
        style={nameStyle}
        className={transactionTypes[2] == "SELL" ? "negativeValue" : "normalValue"}
      >
        {stockNames[2]}
      </Card.Grid>
      <Card.Grid
        hoverable={false}
        style={contentStyle}
        className={transactionTypes[2] === "SELL" ? "negativeValue" : "normalValue"}
      >
        {instrumentType}
      </Card.Grid>
      <Card.Grid
        hoverable={false}
        style={contentStyle}
        className={transactionTypes[2] === "SELL" ? "negativeValue" : "normalValue"}
      >
        {transactionTypes[2]}
      </Card.Grid>
      <Card.Grid hoverable={false} style={nameStyle}>
        Max: {parseFloat(max).toFixed(2)}
      </Card.Grid>
      <Card.Grid hoverable={false} style={nameStyle}>
        Min: {parseFloat(min).toFixed(2)}
      </Card.Grid>
      <Card.Grid
        hoverable={false}
        style={valueStyle}
        className={value == 0 ? "neutralValue" : value > 0 ? "positiveValue" : "negativeValue"}
      >
        {parseFloat(value).toFixed(2)}
      </Card.Grid>
    </Card>
  );
};

export const ButterflyWatch = ({ stockA, stockB, stockC }) => {
  const stockNames = [stockA.displayName, stockB.displayName, stockC.displayName];

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
    <>
      <div className="card_container">
        <WatchCards
          stockNames={stockNames}
          instrumentType="CE"
          transactionTypes={["SELL", "BUY", "SELL"]}
          value={groupOneValue}
        />
        <Title>CE</Title>
        <WatchCards
          stockNames={stockNames}
          instrumentType="CE"
          transactionTypes={["BUY", "SELL", "BUY"]}
          value={groupTwoValue}
        />
      </div>
      <div className="card_container">
        <WatchCards
          stockNames={stockNames}
          instrumentType="PE"
          transactionTypes={["SELL", "BUY", "SELL"]}
          value={groupThreeValue}
        />
        <Title>PE</Title>
        <WatchCards
          stockNames={stockNames}
          instrumentType="PE"
          transactionTypes={["BUY", "SELL", "BUY"]}
          value={groupFourValue}
        />
      </div>
    </>
  );
};
