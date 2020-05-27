import React from "react";
import { Fieldset } from "react95";
import Connection, { options, Method } from "../../containers/Connection";

import Select from "../common/Select";

import ConnectStatus from "./ConnectStatus";
import CustomSigner from "./CustomSigner";
import ByLocalhost from "./ByLocalhost";
import ByMetaMask from "./ByMetaMask";
import ByCustomNode from "./ByCustomNode";

const ConnectOptions = () => {
  const { connection, setConnection } = Connection.useContainer();
  const onChange = (e) => setConnection(e.target.value);
  return (
    <>
      <Fieldset
        label="Connection"
        style={{ marginBottom: "12px", minWidth: "auto" }}
      >
        <Select
          native
          value={connection}
          options={options}
          onChange={onChange}
          width="100%"
          className="connect-options"
        />
        
        <ConnectStatus />

        {connection === Method.Localhost && <ByLocalhost />}
        {connection === Method.MetaMask && <ByMetaMask />}
        {connection === Method.Custom && <ByCustomNode />}
      </Fieldset>
      <CustomSigner />
    </>
  );
};

export default ConnectOptions;
