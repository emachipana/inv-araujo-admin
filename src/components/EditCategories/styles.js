import styled from "@emotion/styled";
import { shadowMd } from "../../styles/layout";
import { COLORS } from "../../styles/colors";

export const Container = styled.div`
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
`;

export const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  padding: 1rem;
`;

export const CategoryContainer = styled.div`
  width: 100%;
  padding: ${({ padding }) => padding || "0 1rem"};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  box-shadow: ${shadowMd};
  border-radius: 0.8rem;
  padding: 1rem 0;
`;

export const Form = styled.form`
  width: ${({ width }) => width || "65%"};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background-color: white;
  border-radius: 1rem;
  gap: 1rem;
  padding: 1rem;
  box-shadow: ${shadowMd};
  background-color: white;
  border: 1px solid ${COLORS.platinium};

  @media screen and (max-width: 550px) {
    width: 80%;
  }

  @media screen and (max-width: 420px) {
    width: 100%;
  }
`;
