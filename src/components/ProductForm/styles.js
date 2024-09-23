import styled from "@emotion/styled";
import { COLORS } from "../../styles/colors";

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const Title = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${COLORS.persian};
  text-align: center;
`;

export const Group = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;

  @media screen and (max-width: 400px) {
    flex-wrap: wrap;
  }
`;
