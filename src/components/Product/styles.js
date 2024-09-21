import styled from "@emotion/styled";
import { COLORS } from "../../styles/colors";
import { shadowSm } from "../../styles/layout";

export const Container = styled.div`
  width: 220px;
  height: 320px;
  border: 1px solid ${COLORS.platinium};
  border-radius: 1rem;
  cursor: pointer;
  box-shadow: ${shadowSm};
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  padding: 0.3rem 0.8rem 0.5rem 0.8rem;
  background-color: white;
  position: relative;
  z-index: 10;
  overflow: hidden;
`;

export const Image = styled.img`
  width: 100%;
  height: 48%;
  cursor: pointer;
  object-fit: contain;
  transition: transform .3s ease-out;
  mix-blend-mode: multiply;

  &:hover {
    transform: scale(1.05);
  }
`;

export const Description = styled.section`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0.3rem;
`;

export const Name = styled.h4`
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 600;
  font-size: 17px;
  max-width: 180px;
  overflow: hidden;
`;

export const Discount = styled.div`
  width: 52px;
  border-radius: 0.5rem;
  background-color: ${COLORS.red};
  position: absolute;
  left: 8px;
  top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TextDescription = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 500;
  font-size: 14px;
  color: ${COLORS.taupe};
  line-height: 14px;
  margin-top: -4px;
`;

export const Brand = styled.div`
  padding: 9px 4px;
  color: white;
  font-weight: 800;
  text-transform: uppercase;
  background-color: ${COLORS.orange};
  border-radius: 0.25rem;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
`;

export const Blocker = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  z-index: 11;
  background-color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
`;

export const Toggle = styled.div`
  width: 45px;
  height: 24px;
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 12;

  .checkbox {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }

  .switch {
    width: 100%;
    height: 100%;
    display: block;
    background-color: ${COLORS.taupe};
    border-radius: 1rem;
    cursor: pointer;
    transition: all 0.2s ease-out;
  }

  .slider {
    width: 20px;
    height: 20px;
    position: absolute;
    left: calc(50% - 20px/2 - 10px);
    top: calc(50% - 20px/2);
    border-radius: 50%;
    background: #FFFFFF;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15), 0px 3px 1px rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease-out;
    cursor: pointer;
  }

  .checkbox:checked + .switch {
    background-color: ${COLORS.persian};
  }

  .checkbox:checked + .switch .slider {
    left: calc(50% - 20px/2 + 10px);
    top: calc(50% - 20px/2);
  }
`;
