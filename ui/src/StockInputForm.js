import React, { useEffect, useState } from "react";
import { Button, Select, Input, InputNumber } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import axios from "axios";

import "./StockInputForm.css";
import { blue } from "@ant-design/colors";

const StockInputForm = ({ label, tType, qty, handleChange }) => {
  const name = "NIFTY";
  const [selected, setSelected] = useState(false);
  const [data, setData] = useState([]);
  const [strikePrice, setStrikePrice] = useState("");
  const [expiry, setExpiry] = useState("");
  const [iType, setIType] = useState("CE");
  const [quantity, setQuantity] = useState(qty);

  useEffect(() => {
    axios
      .get("http://localhost:3001/mapper/byName", { params: { name: "NIFTY" } })
      .then((result) => {
        setData(result.data);
      });
  }, []);

  useEffect(() => {
    setSelected(false);
    const x = data.find((d) => d.tradingsymbol === `${name}${expiry}${strikePrice}${iType}`);
    if (x && quantity) {
      setSelected(true);
      handleChange({
        ...x,
        transactionType: tType,
        product: "NRML",
        quantity: parseInt(quantity),
      });
    }
  }, [data, name, expiry, strikePrice, iType, tType, quantity, handleChange]);

  const mapToStrikePrice = (stockArray) => {
    if (stockArray.length === 0) return [];

    let spSet = new Set();
    stockArray.forEach((s) => {
      spSet.add(s.strike.toString());
    });
    return [...spSet];
  };

  const mapToExpiry = (stockArray, name, strikePrice) => {
    if (stockArray === []) return [];

    let expirySet = new Set();
    stockArray
      .filter((s) => s.strike.toString() === strikePrice)
      .forEach((s) => {
        const ts = s.tradingsymbol;
        const tsTrimmed = ts.substr(0, ts.lastIndexOf(strikePrice));
        const expiry = tsTrimmed.slice(name.length);
        if (expiry) expirySet.add(expiry);
      });
    return [...expirySet];
  };

  return (
    <div className="input_container">
      <div className="input_element">
        <Button type="primary" size="large">
          STOCK {label}:
        </Button>
      </div>
      <div className="input_element">
        <Input size="large" style={{ width: 70 }} value="NIFTY" />
      </div>
      <div className="input_element">
        <Select
          size="large"
          showSearch
          style={{ width: 200 }}
          placeholder="Select Strike Price"
          options={mapToStrikePrice(data).map((d) => {
            return { label: d, value: d };
          })}
          onSelect={(newValue) => {
            setStrikePrice(newValue);
          }}
        ></Select>
      </div>
      <div className="input_element">
        <Select
          size="large"
          showSearch
          style={{ width: 150 }}
          placeholder="Select Expiry"
          options={mapToExpiry(data, name, strikePrice).map((d) => {
            return { label: d, value: d };
          })}
          onSelect={(newValue) => {
            setExpiry(newValue);
          }}
        ></Select>
      </div>
      <div className="input_element">
        <Select
          size="large"
          value={iType}
          options={["CE", "PE"].map((d) => {
            return { label: d, value: d };
          })}
          onSelect={(newValue) => {
            setIType(newValue);
          }}
        ></Select>
      </div>
      <div className="input_element">
        <InputNumber
          size="large"
          value={quantity}
          step={75}
          min={75}
          onChange={(newValue) => {
            setQuantity(newValue);
          }}
        />
      </div>
      <div className="input_element">
        <Input size="large" style={{ width: 60 }} value={tType} />
      </div>
      {selected ? (
        <CheckCircleTwoTone style={{ fontSize: "2rem" }} />
      ) : (
        <CheckCircleTwoTone twoToneColor={blue[0]} style={{ fontSize: "2rem" }} />
      )}
    </div>
  );
};

export default StockInputForm;
