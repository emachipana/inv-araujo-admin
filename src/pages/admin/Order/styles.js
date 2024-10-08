import styled from "@emotion/styled";
import { COLORS } from "../../../styles/colors";

export const Products = styled.div`
  width: 100%;
  border-radius: 1rem;
  border: 2px solid ${COLORS.platinium};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;
`;

export const List = styled.section`
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5rem;
  overflow-y: scroll;
  padding: 1rem;
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 1rem;
`;

export const ProductSection = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const Line = styled.hr`
  width: 100%;
  margin: 0;
  border: 1px solid ${COLORS.dim};
`;
