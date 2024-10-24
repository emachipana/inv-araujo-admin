import styled from "@emotion/styled";
import { COLORS } from "../../../styles/colors";
import { shadowSm } from "../../../styles/layout";

export const Variety = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  border: 2px dashed ${COLORS.taupe};
  box-shadow: ${shadowSm};
  cursor: pointer;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const Section = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  gap: 3rem;
  flex-wrap: wrap;
`;
