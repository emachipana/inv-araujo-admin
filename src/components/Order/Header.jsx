import { FaCalendarAlt } from "react-icons/fa";
import { FlexRow } from "../../styles/layout";
import { Section, Text } from "./styles";

function Header({ name, date }) {
  const parsedDate = new Date(date);
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }

  return (
    <Section>
      <Text
        size="16.8px"
      >
        { name.toLowerCase() }
      </Text>
      <FlexRow>
        <FaCalendarAlt
          color="white"
          size={15}
        />
        <Text
          weight={700}
          size="15px"
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
