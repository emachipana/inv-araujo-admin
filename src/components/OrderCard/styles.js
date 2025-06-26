import styled from "@emotion/styled";
import { FlexRow, shadowMd } from "../../styles/layout";
import { COLORS } from "../../styles/colors";

export const Container = styled.div`
  width: ${({ fullSize }) => fullSize ? "100%" : "250px"};
  height: ${({ fullSize }) => fullSize ? "auto" : "205px"};
  padding: ${({ fullSize }) => fullSize ? "1rem" : "0"};
  ${({ fullSize }) => fullSize && `border: 1px solid ${COLORS.platinium};`}
  border-radius: 0.8rem;
  background-color: white;
  box-shadow: ${shadowMd};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  overflow: hidden;
  transition: .2s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

export const Section = styled.section`
  width: 100%;
  background-color: ${COLORS.persian};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0.6rem 1rem;
  gap: 0.5rem;
`;

export const Text = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: ${({ size }) => size || "1rem"};
  font-weight: ${({ weight }) => weight || 700};
  text-transform: ${({ notCapitalize }) => notCapitalize ? "none" : "capitalize"};
  color: ${({ color }) => color || COLORS.gray};
`;

export const Bottom = styled.div`
  width: 100%;
  border-top: 1px solid ${COLORS.platinium};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1rem;
`;

export const RowBetween = styled(FlexRow)`
  width: 100%;
  justify-content: space-between;
  gap: 1rem;
`;
