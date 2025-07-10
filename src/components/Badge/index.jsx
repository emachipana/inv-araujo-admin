import { COLORS } from "../../styles/colors";
import { Container } from "./styles";

function Badge({ color, children, size }) {
  const colorList = {
    primary: {
      color: COLORS.persian,
      bgColor: COLORS.persian_light
    },
    secondary: {
      color: COLORS.gray,
      bgColor: COLORS.gray_light
    },
    danger: {
      color: COLORS.red,
      bgColor: COLORS.red_light
    },
    warning: {
      color: COLORS.yellow_hover,
      bgColor: COLORS.yellow_light
    },
    orange: {
      color: COLORS.orange,
      bgColor: COLORS.orange_light
    },
    blue: {
      color: COLORS.blue,
      bgColor: COLORS.blue_light
    },
    purple: {
      color: COLORS.purple,
      bgColor: COLORS.purple_light
    }
  }

  return (
    <Container
      size={size}
      color={colorList[color || "primary"].color || COLORS.persian}
      bgColor={colorList[color || "primary"].bgColor || COLORS.persian_light}
    >
      { children }
    </Container>
  )
}

export default Badge;
