import React, { useEffect, useState } from "react";
import { Button, Select } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import axios from "axios";

import "./StockInputForm.css";
import { blue } from "@ant-design/colors";

const StockInputForm = ({ label, handleChange }) => {
  // TODO: Get all values from Local Storage
  const [names, setNames] = useState([]);
  const [name, setName] = useState(localStorage.getItem(`stock${label}.name`) || "NIFTY");
  const [selected, setSelected] = useState(false);
  const [data, setData] = useState([]);
  const [strikePrice, setStrikePrice] = useState(
    localStorage.getItem(`stock${label}.strikePrice`) || "",
  );
  const [expiry, setExpiry] = useState(localStorage.getItem(`stock${label}.expiry`) || "");

  useEffect(() => {
    axios.get("http://localhost:3001/mapper/names").then((result) => {
      setNames(result.data);
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3001/mapper/byName", { params: { name: name } }).then((result) => {
      setData(result.data);
      // setExpiry("");
      // setStrikePrice("");
    });
  }, [name]);

  useEffect(() => {
    setSelected(false);
    const x = data.find((d) => d.tradingsymbol === `${name}${expiry}${strikePrice}CE`);
    const y = data.find((d) => d.tradingsymbol === `${name}${expiry}${strikePrice}PE`);
    if (x && y) {
      setSelected(true);
      handleChange({
        name,
        strikePrice,
        expiry,
        displayName: `${name}${expiry}${strikePrice}`,
        ceToken: x.instrument_token,
        peToken: y.instrument_token,
      });
    }
  }, [data, name, expiry, strikePrice, handleChange]);

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
        <Select
          size="large"
          showSearch
          style={{ width: 200 }}
          placeholder="Select Name"
          value={name}
          options={names.map((n) => {
            return { label: n, value: n };
          })}
          onSelect={(newValue) => {
            setName(newValue);
          }}
        ></Select>
      </div>
      <div className="input_element">
        <Select
          size="large"
          showSearch
          style={{ width: 200 }}
          placeholder="Select Strike Price"
          value={strikePrice}
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
          value={expiry}
          options={mapToExpiry(data, name, strikePrice).map((d) => {
            return { label: d, value: d };
          })}
          onSelect={(newValue) => {
            setExpiry(newValue);
          }}
        ></Select>
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
