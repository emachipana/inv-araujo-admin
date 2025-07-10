/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { Container, Label, Section, Main, TextError } from "./styles";
import { onBlur, setColor } from "./handlers";

function Select({ id, label, value, labelSize, fontSize, handleChange, options = [], handleBlur, error, touched, backgroundColor, firstText, ...props }) {
  const [focused, setFocused] = useState(false);
  const color = setColor(error, touched, focused);

  return (
    <Container>
      { label && <Label size={labelSize} htmlFor={id}>{ label }</Label> }
      <Section
        color={color}
        backgroundColor={backgroundColor}
        {...props}
      >
        <select
          {...props}
          style={{fontSize: fontSize || "1rem"}}
          id={id}
          name={id}
          onChange={handleChange}
          css={Main}
          onBlur={(e) => onBlur(e, setFocused, handleBlur)}
          defaultValue={value || "default"}
        >
          <option disabled value="default">{ firstText || "Elige una" }</option>
          {
            options.map((item, index) => (
              <option 
                value={item.id}
                key={index}
                disabled={item.disabled}
              >
                { item.content }
              </option>
            ))
          }
        </select>
      </Section>
      { touched && error && <TextError>{ error }</TextError> }
    </Container>
  );
}

export default Select;
