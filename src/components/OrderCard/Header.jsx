import { FlexRow } from "../../styles/layout";
import { Section, Text } from "./styles";
import { COLORS } from "../../styles/colors";
import { options } from "./util";
import { FaRegCalendarDays } from "react-icons/fa6";

function Header({ name, date }) {
  const parsedDate = new Date(date);

  return (
    <Section>
      <Text
        color={COLORS.white}
        size="17px"
      >
        { name.toLowerCase() }
      </Text>
      <FlexRow>
        <FaRegCalendarDays
          color={COLORS.smoke}
          size={14}
        />
        <Text
          color={COLORS.smoke}
          size="14px"
        >
          { 
            !date
            ? "Por asignar"
            : parsedDate.toLocaleDateString("es-ES", options)
          }
        </Text>
      </FlexRow>
    </Section>
  );
}

export default Header;
