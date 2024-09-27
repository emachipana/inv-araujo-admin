import styled from "@emotion/styled";
import { COLORS } from "../../styles/colors";

export const Title = styled.h1`
  font-size: ${({ size }) => size || 1.9}rem;
  color: ${({ color }) => color || COLORS.gray};
  font-weight: 700;
  text-transform: ${({ capitalize }) => capitalize ? "capitalize" : "none"};
`;
