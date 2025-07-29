import newStyled from "@emotion/styled";
import { COLORS } from "../../styles/colors";
import { FlexColumn, shadowSm } from "../../styles/layout";

export const MapContainer = newStyled(FlexColumn)`
  width: 100%;
  height: 350px;
  border: 1px solid ${COLORS.platinium};
  box-shadow: ${shadowSm};
  border-radius: 0.5rem;
  overflow: hidden;
  gap: 0;
`;

export const MapFooter = newStyled.div`
  width: 100%;
  padding: 0.5rem;
  background-color: ${COLORS.smoke};
  border-top: 1px solid ${COLORS.platinium};
`;
