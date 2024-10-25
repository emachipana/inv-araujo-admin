import styled from "@emotion/styled";
import { shadowSm } from "../../styles/layout";
import { COLORS } from "../../styles/colors";

export const Container = styled.div`
  width: 420px;
  background-color: white;
  box-shadow: ${shadowSm};
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
`;

export const Card = styled.div`
  width: ${({ size }) => (size + 10) || 130}px;
  height: ${({ size }) => size || 120}px;
  border-radius: 0.75rem;
  background-color: ${({ color }) => color || COLORS.orange};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ gap }) => gap || "1"}rem;
  color: white;
  position: relative;
  padding: 0.5rem;
`;
