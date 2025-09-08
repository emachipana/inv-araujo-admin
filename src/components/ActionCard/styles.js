import newStyled from "@emotion/styled";
import { FlexColumn, FlexRow } from "../../styles/layout";

export const Container = newStyled(FlexColumn)`
  gap: 0.8rem;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
  width: 180px;
  height: 180px;
  border-radius: 0.8rem;
  background-color: ${({ mainColor }) => mainColor};
  transition: .2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ subColor }) => subColor};
  }
`;

export const Icon = newStyled(FlexRow)`
  padding: 1rem;
  border-radius: 1rem;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;
