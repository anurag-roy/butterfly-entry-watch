import React, { useState } from "react";
import { Button, Divider, message } from "antd";
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

  const proceedButton = () => {
    if (!stockA || !stockB || !stockC) {
      message.error(
        "One or more invalid stocks selected. Please select valid stocks and try again.",
      );
    } else {
      axios
        .post("http://localhost:3001/callButterflyEntry", { stockA, stockB, stockC })
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
          <StockInputForm label="A" handleChange={setStockA} />
          <Divider />
          <StockInputForm label="B" handleChange={setStockB} />
          <Divider />
          <StockInputForm label="C" handleChange={setStockC} />
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
            WATCH
          </Button>
        </div>
      </>
    );
  } else {
    return <div>Program started. Please check the console.</div>;
  }
};

export default InputForm;
