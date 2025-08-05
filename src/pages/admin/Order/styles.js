import styled from "@emotion/styled";
import { COLORS } from "../../../styles/colors";
import { FlexColumn, FlexRow, shadowMd, shadowSm } from "../../../styles/layout";

export const Products = styled.div`
  width: 100%;
  border-radius: 1rem;
  border: 2px solid ${COLORS.platinium};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;
`;

export const List = styled.section`
  width: 100%;
  height: ${({ height }) => height || "300px"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ gap }) => gap || "1.5rem"};
  overflow-y: scroll;
  padding: 1rem;
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 1rem;
`;

export const ProductSection = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const Line = styled.hr`
  width: 100%;
  margin: 0;
  border: 1px solid ${COLORS.dim};
`;

export const CancelWrapper = styled.div`
  position: relative;
`;

export const Point = styled.div`
  position: absolute;
  top: -10px;
  right: -5px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${COLORS.red};
  z-index: 2;
`;

export const StateSection = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  gap: 1rem;
`;

export const LineProgress = styled.hr`
  width: 100%;
  border: 1px solid ${COLORS.blue};
  position: absolute;
  z-index: 2;
  opacity: .85;
`;

export const State = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid ${({ isActive, color }) => isActive ? color : COLORS.platinium};
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
`;

export const StateAction = styled(FlexColumn)`
  background-color: white;
  border-radius: 0.75rem;
  border: 1px solid ${COLORS.platinium};
  padding: 0.75rem;
  position: relative;
  box-shadow: ${shadowMd};
  width: 100%;
`;

export const EvidenceSection = styled(FlexColumn)`
  width: 100%;
  gap: 0.5rem;
`;
