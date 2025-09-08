import styled from "@emotion/styled";
import { COLORS } from "../../styles/colors";

export const Container = styled.div`
  border-radius: 0.6rem;
  background-color: ${({ isActive }) => isActive ? COLORS.persian : "white"};
  cursor: pointer;
  border: 1px dashed ${({ isActive }) => isActive ? COLORS.persian : COLORS.dim};
  transition: .2s ease;
  padding: 0.25rem 0.7rem;
  border-style: ${({ isToCreate }) => isToCreate ? "dashed" : "solid"};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${({ isActive }) => isActive ? "white": COLORS.dim};
  position: relative;
  z-index: 2;
  pointer-events: ${({ isBlocked }) => isBlocked ? "none" : ""};

  &:hover {
    background-color: ${COLORS.persian};
    border-color: ${COLORS.persian};
    color: white;
  } 
`;

export const Section = styled.section`
  position: absolute;
  padding: 1rem 0.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: flex-start;
  justify-content: center;
  min-width: 160px;
  top: 100%;
  left: 0;
`;
