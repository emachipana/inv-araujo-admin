import { COLORS } from "../../styles/colors";
import { Container } from "./styles";

function Button({ Icon, color, fontSize, iconPosition, iconSize, children, ...props }) {
  const colorList = {
    primary: {
      background: COLORS.persian,
      hover: COLORS.persian_hover
    },
    secondary: {
      background: COLORS.gray,
      hover: COLORS.dark
    },
    danger: {
      background: COLORS.red,
      hover: COLORS.red_hover
    },
    warning: {
      background: COLORS.yellow,
      hover: COLORS.yellow_hover
    },
    white: {
      background: "white",
      hover: COLORS.persian
    },
    blue: {
      background: COLORS.blue,
      hover: COLORS.blue_hover
    },
    purple: {
      background: COLORS.purple,
      hover: COLORS.purple_hover
    }
  }

  return (
    <Container 
      {...props}
      color={colorList[color || "primary"]}
      fontSize={fontSize}
    >
      { Icon && <Icon size={(iconSize || 22)} style={{marginTop: iconPosition || 0}} /> }
      { children }
    </Container>
  );
}

export default Button;
