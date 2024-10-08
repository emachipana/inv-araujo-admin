import styled from "@emotion/styled";
import { COLORS } from "../../styles/colors";

export const Container = styled.div`
  width: ${({ size }) => size === "sm" ? "80px" : "120px"};
  height: ${({ size }) => size === "sm" ? "30px" : "40px"};
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  z-index: 1;
`;

export const Item = styled.div`
  width: 40px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ isNumber }) => isNumber ? "white" : COLORS.gray};
  cursor: ${({ isNumber }) => isNumber ? "inherit" : "pointer"};
  border: ${({ isNumber }) => isNumber ? `1px solid ${COLORS.taupe}` : "none"};
`;

export const Disabled = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 4;
  pointer-events: fill;
  background-color: rgba(255, 255, 255, .5);
  cursor: not-allowed;
`;
