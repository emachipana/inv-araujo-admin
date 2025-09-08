import styled from "@emotion/styled";

export const Container = styled.div`
  padding: 0.2rem 0.7rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({bgColor}) => bgColor};
  color: ${({color}) => color};
  font-size: ${({ size }) => size || 12}px;
  font-weight: 700;
`;
