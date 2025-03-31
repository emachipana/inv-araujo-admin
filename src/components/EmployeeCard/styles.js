import styled from "@emotion/styled";

export const Container = styled.div`
  width: 300px;
  height: 160px;
  background-color: white;
  box-shadow: 0px 4px 8px 1px rgba(0, 0, 0, .1);
  border-radius: 1rem;
  padding: 1rem;
  cursor: pointer;
`;

export const Name = styled.h6`
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 700;
  font-size: 20px;
  max-width: 268px;
  overflow: hidden;
`;
