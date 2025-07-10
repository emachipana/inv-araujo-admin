import styled from "@emotion/styled";
import { COLORS } from "../../styles/colors";
import { shadowSm } from "../../styles/layout";

export const Page = styled.span`
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  color: ${({ isActive }) => isActive ? 'white' : COLORS.dark};
  background-color: ${({ isActive }) => isActive ? COLORS.dark : 'white'};
  border: 1px solid #E5E7EB;
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  box-shadow: ${shadowSm};

  &:hover {
    background-color: ${({ isActive }) => isActive ? COLORS.dark : COLORS.smoke};
  }
`;

export const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  color: #6B7280;
`;
