import styled from "@emotion/styled";

export const Container = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({bgColor}) => bgColor};
  color: ${({color}) => color};
  font-size: ${({ size }) => size || 13}px;
  font-weight: 700;
`;
