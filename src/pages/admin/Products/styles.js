import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { shadowSm } from "../../../styles/layout";

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
    min-width: 40px;
  }
`;

export const ProductItem = styled.label`
  width: 100%;
  cursor: pointer;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0px 6px 10px 1px rgba(0, 0, 0, .2);
  padding: 0.5rem 1rem;
`;
