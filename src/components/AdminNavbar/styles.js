import styled from "@emotion/styled";
import { COLORS } from "../../styles/colors";

export const Container = styled.div`
  width: 100%;
  height: 70px;
  background-color: ${COLORS.persian};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 2rem;
  grid-area: navbar;
  position: sticky;
  top: 0;
  z-index: 30;

  .handler {
    @media screen and (max-width: 800px) {
      display: none;
    }
  }

  .activer {
    @media screen and (min-width: 800px) {
      display: none;
    }
  }

  @media screen and (max-width: 475px) {
    padding: 0.5rem;
  }
`;

export const Logo = styled.img`
  height: 35px;
  object-fit: cover;
  margin-top: -5px;

  @media screen and (max-width: 440px) {
    height: 20px;
  }
`;

export const Point = styled.div`
  width: 10px;
  height: 10px;
  background-color: ${COLORS.red};
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
`;

export const Notification = styled.div`
  position: relative;
  cursor: pointer;
`;

export const Header = styled.div`
  width: 100%;
  height: 40px;
  background-color: ${COLORS.gray};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
`;

export const Item = styled.div`
  width: 145px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.8rem 0.8rem 0.3rem 0.8rem;
  gap: 0.5rem;
  cursor: pointer;
  transition: .2s ease;
  color: ${COLORS.dim};

  &:hover {
    color: ${COLORS.persian};
  }
`;

export const Hr = styled.hr`
  margin: 0 0.8rem;
`;
