import styled from "@emotion/styled";
import { FlexRow } from "../../styles/layout";
import { COLORS } from "../../styles/colors";

export const Container = styled(FlexRow)`
  background-color: ${({ isActive }) => isActive ? COLORS.blue : "white"};
  padding: 0.3rem 0.65rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ isActive }) => isActive ? COLORS.blue : COLORS.taupe};
  gap: 1rem;
  justify-content: space-between;
  cursor: pointer;
  transition: .2s ease;

  &:hover {
    background-color: ${({ isActive }) => isActive ? COLORS.blue : COLORS.platinium};
  }
`;

export const ItemContainer = styled.div`
  min-width: ${({ minWidth }) => minWidth || 150}px;
  padding: 0.5rem .75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: .2s ease;
  font-weight: 600;
  font-size: 15px;
  background-color: ${({ isActive }) => isActive ? COLORS.blue : "transparent"};
  color: ${({ isActive }) => isActive ? "white" : COLORS.dim};

  &:hover {
    background-color: ${COLORS.blue};
    color: white;
  }
`;
