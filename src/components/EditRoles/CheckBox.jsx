import { CheckboxContainer, CheckboxLabel, CheckIcon, HiddenCheckbox, StyledCheckbox } from "./styles";

const Checkbox = ({ checked, onChange, label, disabled = false, id, ...props }) => {
  const handleChange = (e) => {
    if (onChange && !disabled) {
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          id: id,
          checked: !checked
        }
      };
      onChange(newEvent);
    }
  };

  return (
    <CheckboxContainer 
      {...props}
    >
      <HiddenCheckbox
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <StyledCheckbox
        checked={checked} 
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          handleChange(e);
        }}
      >
        <CheckIcon
          viewBox="0 0 24 24" 
          checked={checked}
        >
          <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
        </CheckIcon>
      </StyledCheckbox>
    {label && (
      <CheckboxLabel
        htmlFor={id}
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          handleChange(e);
        }}
      >
        {label}
      </CheckboxLabel>
    )}
  </CheckboxContainer>
  );
};

export default Checkbox;
