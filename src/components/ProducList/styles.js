import { css } from "@emotion/react";
import { shadowSm } from "../../styles/layout";

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
