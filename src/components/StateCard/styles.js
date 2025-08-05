import { COLORS } from "../../styles/colors";
import styled from "@emotion/styled";

export const Container = styled.div`
  width: 100%;
  margin-top: ${({ isCanceled }) => isCanceled ? "0" : "1.5rem"};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  background-color: ${({ color }) => color};
  padding: 0.5rem;
  border-radius: 0.75rem;
  border: 1px solid ${COLORS.platinium};
`;

export const IconWrapper = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: ${COLORS.smoke};
  display: flex;
  align-items: center;
  justify-content: center;
`;
