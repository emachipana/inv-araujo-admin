import styled from "@emotion/styled";
import { COLORS } from "../../styles/colors";
import { FONTS } from "../../styles/fonts";
import { shadowSm } from "../../styles/layout";

export const Section = styled.section`
  width: 450px;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)), url("/img/slider.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  box-shadow: ${shadowSm};
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  cursor: pointer;
`;

export const Title = styled.h5`
  font-size: 15px;
  font-weight: 800;
  color: ${COLORS.platinium};
  text-transform: uppercase;
`;

export const Content = styled.h4`
  font-size: ${({ size }) => size || 75}px;
  line-height: ${({ height }) => height || 100}px;
  font-family: ${FONTS.secondary};
  color: ${COLORS.white};
  text-transform: uppercase;

  .marked {
    color: ${COLORS.persian};
  }
`;
