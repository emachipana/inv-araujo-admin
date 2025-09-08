import newStyled from "@emotion/styled";
import { COLORS } from "../../styles/colors";
import { FlexRow } from "../../styles/layout";

export const Container = newStyled(FlexRow)`
  width: 100%;
  border: 1px solid ${({ isActive }) => isActive ? COLORS.blue : COLORS.taupe};
  padding: 1rem;
  border-radius: 0.75rem;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: .2s ease;

  &:hover {
    border-color: ${COLORS.blue};
  }
`;
