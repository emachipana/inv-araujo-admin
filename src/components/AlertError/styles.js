import styled from "@emotion/styled";

export const Container = styled.div`
  position: fixed;
  bottom: 5px;
  right: 0;
  left: 0;
  margin: auto;
  width: fit-content;
  height: auto;
  animation: up 1s ease;
  z-index: 100;

  @keyframes up {
    from {
      transform: translateY(100%);
    }

    to {
      transform: translateY(0);
    }
  }
`;
