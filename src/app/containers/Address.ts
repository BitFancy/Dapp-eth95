import { createContainer } from "unstated-next";
import { useState, useEffect } from "react";
import Connection from "./Connection";

export function useAddress() {
  const { customSigner, internalSigner } = Connection.useContainer();
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const signer = customSigner || internalSigner;
    if (signer) {
      signer.getAddress().then((address) => setAddress(address));
    }
  }, [internalSigner, customSigner]);

  return {
    address,
  };
}

export default createContainer(useAddress);
