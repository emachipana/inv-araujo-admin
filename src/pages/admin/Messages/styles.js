import newStyled from "@emotion/styled";
import { shadowMd } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";

export const Container = newStyled.div`
  width: 100%;
  background-color: white;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: ${shadowMd};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Image = newStyled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid ${COLORS.platinium};
`;

export const Line = newStyled.hr`
  width: 100%;
  border: 1px solid ${COLORS.taupe};
`;
