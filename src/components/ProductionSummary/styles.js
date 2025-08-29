import newStyled from "@emotion/styled";
import { COLORS } from "../../styles/colors";
import { FlexColumn, shadowMd } from "../../styles/layout";
import { IoClose } from "react-icons/io5";

export const Container = newStyled.div`
  border-radius: 0.75rem;
  border: 2px dashed ${COLORS.dim};
  padding: 0.65rem 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
`;

export const Title = newStyled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${COLORS.dim};
`;

export const Card = newStyled(FlexColumn)`
  width: 250px;
  padding: 0.65rem 0.5rem;
  border-radius: 0.75rem;
  background-color: white;
  box-shadow: ${shadowMd};
  border: 1px solid ${COLORS.platinium};
  align-items: center;
  gap: 1rem;
`;

export const Close = newStyled(IoClose)`
  cursor: pointer;
  color: ${COLORS.dim};
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 1.35rem;
`;
