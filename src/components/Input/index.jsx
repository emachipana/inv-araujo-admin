/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { Container, Label, Main, Section, TextError } from "./styles";
import { COLORS } from "../../styles/colors";

export const onBlur = (e, setFocused, handleBlur) => {
  setFocused(false);

  handleBlur && handleBlur(e);
}

export const setColor = (error, touched, focused) => {
  return error && touched
  ? COLORS.red
  : (touched && !error
    ? COLORS.persian
    : (focused
        ? COLORS.persian
        : COLORS.taupe));
}

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
          {...props}
        />
      </Section>
      { touched && error && <TextError>{ error }</TextError> }
    </Container>
  );
}

export default Input;
