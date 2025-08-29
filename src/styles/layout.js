import styled from "@emotion/styled";
import { FONTS } from "./fonts";

export const Text = styled.p`
  font-size: ${({ size }) => size || 16}px;
  font-weight: ${({ weight }) => weight || 500};
  color: ${({ color }) => color || "inherit"};
  text-decoration: ${({ isLink }) => isLink ? "underline" : "none"};
  cursor: ${({ isLink }) => isLink ? "pointer" : "inherit"};
  text-align: ${({ align }) => align || "center"};
  font-family: ${FONTS.primary};
`;

export const FlexRow = styled.div`
  width: ${({ width }) => width || "auto"};
  display: flex;
  align-items: ${({ align }) => align || "center"};
  justify-content: ${({ justify }) => justify || "center"};
  gap: ${({ gap }) => gap || 0.5}rem;
`;

export const FlexColumn = styled.div`
  width: ${({ width }) => width || "auto"};
  display: flex;
  flex-direction: column;
  align-items: ${({ align }) => align || "flex-start"};
  justify-content: ${({ justify }) => justify || "center"};
  gap: ${({ gap }) => gap || 0.5}rem;
`;

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-rows: 70px 1fr;
  background-color: #F9FAFB;
  position: relative;
  grid-template-areas: 
            "navbar navbar"
            "aside main";

  @media screen and (max-width: 800px) {
    display: block;
  }
`;

export const Section = styled.section`
  width: 100%;
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;
  padding-bottom: 3rem;
  overflow: auto;
  position: relative;
`;

export const Image = styled.img`
  width: ${({ width }) => width || "100px"};
  object-fit: cover;
  border-radius: ${({ radius }) => radius || "1rem"};
  mix-blend-mode: multiply;
`;

export const shadowSm = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";

export const shadowMd = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";

export const shadowLg = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"

export const Form = styled.form`
  width: ${({ width }) => width || "100%"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ gap }) => gap || 1}rem;

  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;
