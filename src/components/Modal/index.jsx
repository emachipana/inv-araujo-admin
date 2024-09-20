/** @jsxImportSource @emotion/react */

import { IoClose } from "react-icons/io5";
import { Close, Container, Section } from "./styles";

function Modal({ isActive, setIsActive, children, size, padding, align }) {
  const handleClick = () => setIsActive(!isActive);

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
        size={size}
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
