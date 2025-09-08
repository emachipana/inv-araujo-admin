import styled from "@emotion/styled";
import { shadowSm } from "../../styles/layout";
import { COLORS } from "../../styles/colors";

export const ClientSection = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  box-shadow: ${shadowSm};
  background-color: white;
  border: 1px solid ${COLORS.platinium};
`;
