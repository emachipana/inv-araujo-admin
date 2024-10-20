import styled from "@emotion/styled";

export const Doc = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
`;

export const Loader = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .7);
  display: flex;
  align-items: center;
  justify-content: center;
`;
