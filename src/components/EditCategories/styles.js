import styled from "@emotion/styled";

export const Container = styled.div`
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
`;

export const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
`;

export const CategoryContainer = styled.div`
  width: 100%;
  padding: ${({ padding }) => padding || "1rem"};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  box-shadow: 0 2px 3px 1px rgba(0, 0, 0, .2);
  border-radius: 0.5rem;
`;