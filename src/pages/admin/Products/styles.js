import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { COLORS } from "../../../styles/colors";
import { shadowSm } from "../../../styles/layout";

export const Filter = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
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

export const Container = css`
  border-radius: 1rem;
  width: 100%;
  overflow: hidden;
  table-layout: auto;
  box-shadow: ${shadowSm};
  border-collapse: collapse;

  th {
    text-align: center;
    vertical-align: middle;
    height: 70px;
    min-width: 40px;
  }
`;

