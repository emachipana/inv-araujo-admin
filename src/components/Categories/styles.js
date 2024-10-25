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

export const Blocker = styled.div`
  width: 100%;
  height: 100%;
  z-index: 4;
  background-color: rgba(255, 255, 255, .2);
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
  cursor: not-allowed;
  margin: auto;
`;
