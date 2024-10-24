import styled from "@emotion/styled";
import { shadowSm } from "../../styles/layout";

export const ClientSection = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  box-shadow: ${shadowSm};
  background-color: rgba(255, 255, 255, .8);
`;
