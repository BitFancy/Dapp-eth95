import React, { useEffect } from "react";
import styled from "styled-components";
import Contracts from "../../containers/Contracts";

interface IProps {
  isActive: boolean;
}

const Item = styled.div`
  height: 24px;
  color: ${(p: IProps) => (p.isActive ? "white" : "unset")};
  background: ${(p: IProps) => (p.isActive ? "#050289" : "unset")};
  border: ${(p: IProps) => (p.isActive ? "1px dotted" : "unset")};
  cursor: default;
  padding: 2px 4px;
`;

const ContractItem = ({ name, idx = 0 }: { name: string; idx: number }) => {
  const { setSelectedIdx, selectedIdx } = Contracts.useContainer();
  const isActive = selectedIdx === idx;

  const handleClick = () => {
    setSelectedIdx(isActive ? null : idx);
  };

  // ensure an active item is always in view
  const ref = React.createRef<HTMLDivElement>();
  useEffect(() => {
    if (isActive) {
      ref.current.scrollIntoView({ block: "nearest" });
    }
  }, [isActive]);

  return (
    <Item
      isActive={isActive}
      onClick={handleClick}
      className="contract-list-item"
      ref={ref}
    >
      {name}
    </Item>
  );
};

export default ContractItem;
