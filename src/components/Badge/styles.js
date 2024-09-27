import styled from "@emotion/styled";

export const Container = styled.div`
  padding: 3px 5px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({color}) => color};
  text-transform: uppercase;
  color: white;
  font-size: ${({ size }) => size || 12}px;
  font-weight: 800;
`;
