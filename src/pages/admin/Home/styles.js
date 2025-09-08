import styled from "@emotion/styled";
import { shadowMd } from "../../../styles/layout";
import { css } from "@emotion/react";
import { COLORS } from "../../../styles/colors";

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;

  @media screen and (max-width: 890px) {
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
  }
`;

export const Group = styled.div`
  width: ${({ width }) => width || 40}%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media screen and (max-width: 890px) {
    width: 100%;
  }
`;

export const Section = styled.section`
  width: ${({ width }) => width || 60}%;
  height: ${({ height }) => height || "420px"};
  background-color: white;
  display: flex;
  flex-direction: ${({ direction }) => direction || "row"};
  align-items: ${({ align }) => align || "center"};
  justify-content: ${({ justify }) => justify || "center"};
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid ${COLORS.platinium};
  box-shadow: ${shadowMd};
  overflow-x: auto;

  @media screen and (max-width: 890px) {
    width: 100%;
  }
`;

export const TableStyle = css`
  width: 100%;
  overflow-x: auto;
  table-layout: auto;
  border-collapse: collapse;
  min-width: 650px;

  th {
    text-align: center;
    vertical-align: middle;
    min-width: 45px;
  }
`;
