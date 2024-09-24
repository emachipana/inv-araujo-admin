/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { Container, Label, Main, Section, TextError } from "./styles";
import { onBlur, setColor } from "./handlers";

function Input({ 
  id, disabled, label, placeholder, labelSize,
  type, value, handleChange, handleBlur, fontSize,
  error, touched, Icon, backgroundColor, ...props }) {

  const [focused, setFocused] = useState(false);
  const color = setColor(error, touched, focused);

  return (
    <Container>
      { label && <Label size={labelSize} htmlFor={id}>{ label }</Label> }
      <Section
        isFile={type === "file"}
        color={color}
        backgroundColor={backgroundColor}
        disabled={disabled}
      >
        { Icon && <Icon size={25} color={color} /> }
        <input 
          id={id}
          style={{fontSize: fontSize || "1rem"}}
          disabled={disabled}
          placeholder={placeholder}
          type={type || "text"}
          value={value}
          onChange={handleChange}
          onBlur={(e) => onBlur(e, setFocused, handleBlur)}
          onFocus={() => setFocused(true)}
          css={Main}
        />
      </Section>
      { touched && error && <TextError>{ error }</TextError> }
    </Container>
  );
}

export default Input;
