import styled from "@emotion/styled";
import { COLORS } from "../../../styles/colors";

export const Filter = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const Group = styled.div`
  border-radius: 1rem;
  border: 1px solid ${COLORS.taupe};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.5rem;
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

export const Section = styled.section`
  width: 100%;
  display: flex;
  justify-content: ${({ justify }) => justify || "space-evenly"};
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 2rem;

  @media screen and (max-width: 1072px) {
    justify-content: center;
  }
`;
