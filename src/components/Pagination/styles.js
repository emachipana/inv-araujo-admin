import styled from "@emotion/styled";
import { COLORS } from "../../styles/colors";

export const Page = styled.span`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 50%;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ isActive }) => isActive ? "white" : COLORS.gray};
  background-color: ${({ isActive }) => isActive ? COLORS.gray : "transparent"};  
  transition: .3s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ isActive }) => isActive ? COLORS.gray : COLORS.taupe};
    color: white;
  }
`;
