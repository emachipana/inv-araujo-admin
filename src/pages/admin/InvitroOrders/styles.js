import styled from "@emotion/styled";
import { FlexColumn, shadowSm } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";

export const HeaderPage = styled(FlexColumn)`
  width: 100%;
  gap: 2rem;
  padding: 1rem;
  border-radius: 1rem;
  background-color: white;
  box-shadow: ${shadowSm};
  border: 1px solid ${COLORS.platinium};
`;

export const MenuSection = styled(FlexColumn)`
  padding: 0.25rem;
  gap: 0.25rem;
`;
