import styled from "@emotion/styled";
import { COLORS } from "../../../styles/colors";

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 1rem 0 0;
  padding: 0;
`;

export const PaginationContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  justify-content: space-between;
`;

export const PageButton = styled.button`
  background: transparent;
  color: ${COLORS.dim};
  border: 1px solid ${COLORS.border};
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.3 : 1};
  transition: all 0.2s ease;
  font-size: 14px;
  padding: 0;
  
  &:hover:not(:disabled) {
    background: ${COLORS.background};
  }
`;

