import React from "react";
import Modal from "react-modal";
import "./styles/global.css";

import Address from "./containers/Address";
import Contracts from "./containers/Contracts";
import Websockets from "./containers/Websockets";
import Connection from "./containers/Connection";
import Layout from "./features/common/Layout";
import Sidebar from "./features/sidebar/Sidebar";
import Main from "./features/main/Main";

Modal.setAppElement("#root");

const App = () => (
  <Contracts.Provider>
    <Websockets.Provider>
      <Connection.Provider>
        <Address.Provider>
          <Layout>
            <Sidebar />
            <Main />
          </Layout>
        </Address.Provider>
      </Connection.Provider>
    </Websockets.Provider>
  </Contracts.Provider>
);

export default App;
