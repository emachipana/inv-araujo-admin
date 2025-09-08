import newStyled from "@emotion/styled";
import { FlexColumn, shadowLg, shadowMd } from "../../styles/layout";
import { COLORS } from "../../styles/colors";

export const Container = newStyled(FlexColumn)`
  width: ${({ fullSize }) => fullSize ? "100%" : "240px"};
  height: ${({ fullSize }) => fullSize ? "180px" : "260px"};
  border-radius: 0.75rem;
  border: 1px solid ${COLORS.platinium};
  box-shadow: ${shadowMd};
  cursor: pointer;
  transition: .2s ease;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: white;

  &:hover {
    box-shadow: ${shadowLg};
  }
`;

export const Image = newStyled.img`
  width: 85px;
  height: 85px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid ${COLORS.platinium};
`;
