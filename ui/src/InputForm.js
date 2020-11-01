import React, { useState } from "react";
import { InputNumber, Button, Divider, message } from "antd";
import StockInputForm from "./StockInputForm";
import SelectedStock from "./SelectedStock";
import axios from "axios";

import "./InputForm.css";
import "./StockInputForm.css";

const InputForm = () => {
  const [state, setState] = useState("initial");

  const [stockA, setStockA] = useState();
  const [stockB, setStockB] = useState();
  const [stockC, setStockC] = useState();

  const [aQty, setAQty] = useState(75);
  const [bQty, setBQty] = useState(150);
  const [cQty, setCQty] = useState(75);

  const [entryPrice, setEntryPrice] = useState();

  const proceedButton = () => {
    if (!stockA || !stockB || !stockC) {
      message.error(
        "One or more invalid stocks selected. Please select valid stocks and try again.",
      );
    } else if (!entryPrice) {
      message.error("Missing entry price. Please input entry price and try again.");
    } else {
      axios
        .post("http://localhost:3001/callButterflyEntry", { stockA, stockB, stockC, entryPrice })
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
      setState("done");
    }
  };

  if (state === "initial") {
    return (
      <>
        <div className="form_container">
          <Divider />
          <StockInputForm label="A" tType="SELL" qty={aQty} handleChange={setStockA} />
          <Divider />
          <StockInputForm label="B" tType="BUY" qty={bQty} handleChange={setStockB} />
          <Divider />
          <StockInputForm label="C" tType="SELL" qty={cQty} handleChange={setStockC} />
          <Divider />
          <div className="input_container">
            <Button type="primary" size="large">
              ENTRY PRICE:
            </Button>
            <div className="input_element">
              <InputNumber
                size="large"
                style={{ width: 200 }}
                value={entryPrice}
                min={0}
                onChange={(newValue) => {
                  setEntryPrice(newValue);
                }}
              />
            </div>
          </div>
          <Divider />
        </div>
        <div className="input_container">
          <div className="input_element">
            <SelectedStock input={"A"} data={stockA} />
          </div>
          <div className="input_element">
            <SelectedStock input={"B"} data={stockB} />
          </div>
          <div className="input_element">
            <SelectedStock input={"C"} data={stockC} />
          </div>
        </div>
        <div className="input_container">
          <Button type="primary" size="large" onClick={proceedButton}>
            Enter Market
          </Button>
        </div>
      </>
    );
  } else {
    return <div>Program started. Please check the console.</div>;
  }
};

export default InputForm;
