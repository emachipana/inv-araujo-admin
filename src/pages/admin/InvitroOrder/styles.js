import styled from "@emotion/styled";
import { COLORS } from "../../../styles/colors";
import { shadowSm } from "../../../styles/layout";

export const Variety = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  border: 2px dashed ${COLORS.taupe};
  box-shadow: ${shadowSm};
  cursor: pointer;
`;
