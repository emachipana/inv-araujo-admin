import { Container, Section } from "./styles";

function DropDown({ isOpen, rightPosition, setIsOpen, children, Button, buttonData, ...props }) {
  return (
    <Container
      {...props}
      onMouseOver={() => setIsOpen(true)}
      onMouseOut={() => setIsOpen(false)}
    >
      <Button {...buttonData} />
      { isOpen && <Section right={rightPosition}>{ children }</Section> }
    </Container>
  );
}

export default DropDown;
