/** @jsxImportSource @emotion/react */

import { IoClose } from "react-icons/io5";
import { Close, Container, Section } from "./styles";

function Modal({ isActive, setIsActive, children, size, padding, align }) {
  const handleClick = () => setIsActive(!isActive);

  const modalSizes = {
    sm: "420px",
    md: "580px",
    lg: "680px",
    xl: "90%"
  };

  return (
    isActive
    &&
    <Container
      align={align}
      onClick={handleClick}
      isActive={isActive}
    >
      <Section
        padding={padding}
        onClick={(e) => e.stopPropagation()}
        width={modalSizes[size] || modalSizes.sm}
      >
        <IoClose 
          onClick={handleClick}
          css={Close}
        />
        { children }
      </Section>
    </Container>
  );
}

export default Modal;
