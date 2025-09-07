import newStyled from "@emotion/styled";

export const OrderCard = newStyled.div`
  width: 35px;
  height: 35px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: ${({ color }) => color};
`;
