import styled from "@emotion/styled";
import { COLORS } from "../../styles/colors";
import { FlexRow } from "../../styles/layout";

export const Container = styled(FlexRow)`
  width: 100%;
  justify-content: space-between;
  gap: 1rem;
`;

export const Group = styled.div`
  border-radius: 1rem;
  border: 1px solid ${COLORS.taupe};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.15rem 0.4rem;
  gap: 0.3rem;
`;

export const Wrapper = styled.div`
  color: ${COLORS.dim};
  cursor: pointer;
  border-radius: 50%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: .3s ease;
  background-color: ${({ isActive }) => isActive ? COLORS.platinium : "transparent"};

  &:hover {
    background-color: ${COLORS.platinium};
  }
`;
