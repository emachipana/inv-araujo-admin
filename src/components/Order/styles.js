import styled from "@emotion/styled";
import { shadowSm } from "../../styles/layout";

export const Container = styled.div`
  width: 315px;
  height: 170px;
  border-radius: 1rem;
  background-color: white;
  box-shadow: ${shadowSm};
  padding: 0.8rem;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/img/slider.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center bottom;
  cursor: pointer;
`;

export const Section = styled.section`
  width: 100%;
  background-color: rgba(0, 170, 149, .8);
  height: 52%;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.7rem;
  padding: 0.6rem 0.8rem;
`;

export const Text = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: ${({ size }) => size || "1rem"};
  color: white;
  font-weight: ${({ weight }) => weight || "800"};
  text-transform: capitalize;
  line-height: 22px;
`;
