import { COLORS } from "../../styles/colors";
import { Container } from "./styles";

function Badge({ color, children, size }) {
  const colorList = {
    primary: COLORS.persian,
    secondary: COLORS.gray,
    danger: COLORS.red,
    warning: COLORS.yellow
  }

  return (
    <Container
      size={size}
      color={colorList[color] || COLORS.persian}
    >
      { children }
    </Container>
  )
}

export default Badge;
