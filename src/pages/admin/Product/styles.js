import styled from "@emotion/styled";
import { shadowSm } from "../../../styles/layout";

export const Section = styled.section`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;

  @media screen and (max-width: 960px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

export const Card = styled.div`
  width: ${({ position }) => position === "first" ? 42 : 58}%;
  background-color: white;
  border-radius: 1rem;
  box-shadow: ${shadowSm};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

  @media screen and (max-width: 960px) {
    width: 100%;
  }
`;

export const Wrapper = styled.section`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: ${({ justify }) => justify || "space-between"};
  gap: 1.5rem;
  flex-wrap: wrap;

  @media screen and (max-width: 1340px) {
    justify-content: ${({ isButtons, justify }) => isButtons ? "center" : (justify || "space-between")};
  }
`;
