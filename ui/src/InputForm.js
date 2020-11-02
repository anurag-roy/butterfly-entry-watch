import React, { useState } from "react";
import { Button, Divider, message } from "antd";
import StockInputForm from "./StockInputForm";

import "./InputForm.css";
import "./StockInputForm.css";
import { ButterflyWatch } from "./ButterflyWatch";

const InputForm = () => {
  const [state, setState] = useState("selectingStocks");

  const [stockA, setStockA] = useState();
  const [stockB, setStockB] = useState();
  const [stockC, setStockC] = useState();

  const proceedButton = () => {
    // if (!stockA || !stockB || !stockC) {
    //   message.error(
    //     "One or more invalid stocks selected. Please select valid stocks and try again.",
    //   );
    // } else {
    //   setState("stocksSelected");
    // }
    setState("stocksSelected");
  };

  if (state === "selectingStocks") {
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
          <Button type="primary" size="large" onClick={proceedButton}>
            WATCH
          </Button>
        </div>
      </>
    );
  } else {
    return <ButterflyWatch stockA={stockA} stockB={stockB} stockC={stockC} />;
  }
};

export default InputForm;
