import styled from "@emotion/styled";
import { COLORS } from "../../../styles/colors";
import { shadowSm } from "../../../styles/layout";

export const Info = styled.section`
  width: 260px;
  background-color: white;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  box-shadow: ${shadowSm};
`;

export const Mini = styled.div`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 2px solid ${COLORS.platinium};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const Days = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: ${({ gap }) => gap || "0.2rem 0"};
`;

export const Day = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: .2s ease-in;
  cursor: pointer;
  background-color: ${({ isActive }) => isActive ? COLORS.persian : "transparent"};
  color: ${({ isActive }) => isActive ? "white" : "inherit"};

  &:hover {
    background-color: ${({ day }) => day ? COLORS.persian : "transparent"};
    color: white;
  } 
`;

export const Main = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-x: auto;
  box-shadow: ${shadowSm};
`;               

export const Wrapper = styled.div`
  height: ${({ type }) => type === "day" ? "90px" : "auto"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.5rem;
  background-color: ${({ bgColor }) => bgColor || COLORS.smoke};
  border-right: 2px solid ${COLORS.platinium};
  cursor: ${({ type }) => type === "day" ? "pointer" : "inherit"};
  border-bottom-color: ${({ current }) => current ? COLORS.persian : COLORS.platinium};
  border-bottom-width: ${({ current }) => current ? "4px" : "2px"};
  border-bottom-style: solid;
  gap: 0.5rem;
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  @media screen and (max-width: 1210px) {
    flex-wrap: wrap;
    // justify-content: center;
  }
`;
