/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { Container, Label, Main, Section, TextError } from "./styles";
import { onBlur, setColor } from "./handlers";

function TextArea({ 
  id, disabled, label, placeholder, labelSize,
  value, handleChange, handleBlur, fontSize,
  error, touched, backgroundColor, ...props }) {

  const [focused, setFocused] = useState(false);
  const color = setColor(error, touched, focused);

  return (
    <Container>
      { label && <Label size={labelSize} htmlFor={id}>{ label }</Label> }
      <Section
        type="textarea"
        color={color}
        backgroundColor={backgroundColor}
      >
        <textarea
          id={id}
          style={{fontSize: fontSize || "1rem", resize: "none"}}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={(e) => onBlur(e, setFocused, handleBlur)}
          onFocus={() => setFocused(true)}
          css={Main}
          {...props}
        />
      </Section>
      { touched && error && <TextError>{ error }</TextError> }
    </Container>
  );
}

export default TextArea;
