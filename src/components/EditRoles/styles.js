import styled from "@emotion/styled";
import { COLORS } from "../../styles/colors";
import { FlexColumn, FlexRow, shadowLg, shadowMd } from "../../styles/layout";

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
  user-select: none;
`;

export const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
  
  &[type="checkbox"] {
    box-sizing: border-box;
  }
`;

export const StyledCheckbox = styled.div`
  width: 18px;
  height: 18px;
  background: ${props => props.checked ? COLORS.persian : 'white'};
  border: 2px solid ${props => props.checked ? COLORS.persian : COLORS.dim};
  border-radius: 4px;
  margin-right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
  flex-shrink: 0;
  opacity: ${props => props.disabled ? 0.6 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    border-color: ${props => !props.disabled && COLORS.persian};
  }
`;

export const CheckIcon = styled.svg`
  width: 12px;
  height: 12px;
  fill: white;
  visibility: ${props => (props.checked ? 'visible' : 'hidden')};
`;

export const CheckboxLabel = styled.label`
  font-size: 14px;
  color: ${props => props.disabled ? COLORS.dim : COLORS.dark};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin: 0;
  line-height: 1.4;
`;

export const Card = styled(FlexColumn)`
  width: 280px;
  height: ${({ height }) => height || "auto"};
  max-height: 330px;
  border-radius: 0.5rem;
  border: 1px solid ${COLORS.platinium};
  gap: 0;
  overflow: hidden;
  box-shadow: ${shadowLg};
`;

export const CardHeader = styled(FlexRow)`
  height: 50px;
  width: 100%;
  background-color: ${COLORS.platinium};
  padding: 1rem;
  justify-content: flex-start;
`;

export const CardBody = styled(FlexColumn)`
  padding: 1rem;
  gap: 1rem;
  height: 350px;
  width: 100%;
  overflow-y: auto;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const RoleContainer = styled(FlexColumn)`
  width: 100%;
  padding: 1rem;
  gap: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: ${shadowMd};
`;
