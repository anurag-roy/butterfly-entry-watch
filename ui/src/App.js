import React from "react";
import InputForm from "./InputForm";

import { Typography } from "antd";
import { blue } from "@ant-design/colors";
import "../node_modules/antd/dist/antd.css";

const App = () => {
  const { Title } = Typography;

  return (
    <div style={{ backgroundColor: blue[0], height: "100%" }}>
      <Title style={{ textAlign: "center", paddingTop: "1em" }}>Call Butterfly Entry</Title>
      <InputForm />
    </div>
  );
};

export default App;
