import styled from "@emotion/styled";

export const Container = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${({ isLoading }) => isLoading ? "center" : "flex-start"};
  gap: 1rem;
  flex-wrap: wrap;

  @media screen and (max-width: 650px) {
    justify-content: center;
    gap: 0.7rem;
  }
`;
