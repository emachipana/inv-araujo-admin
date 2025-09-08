import { COLORS } from "../../../styles/colors";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { Image } from "./styles";
import { capitalize, capitalizeAll } from "../../../helpers/capitalize";
import { FaTrashAlt } from "react-icons/fa";

function Message({ id, fullName, email, content, subject, phone, createdAt, onDeleteClick }) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    locale: 'es-ES'
  }

  const date = new Date(createdAt);;

  return (
    <FlexRow
      width="100%"
      justify="space-between"
    >
      <FlexRow
        style={{maxWidth: "60%"}}
      >
        <Image 
          alt="user_profile"
          src="/img/user_default.jpg"
        />
        <FlexColumn>
          <FlexColumn
            style={{gap: 0}}
          >
            <Text
              size={14}
              weight={500}
              color={COLORS.taupe}
            >
              { capitalize(date.toLocaleDateString("es-ES", options)) }
            </Text>
            <Text
              size={17}
              weight={700}
            >
              { capitalizeAll(fullName.toLowerCase()) }
            </Text>
          </FlexColumn>
          <FlexColumn
            style={{gap: 0}}
          >
            <Text
              weight={600}
              color={COLORS.dim}
            >
              { subject }
            </Text>
            <Text
              align="start"
              size={14}
              weight={500}
              color={COLORS.taupe}
            >
              { content }
            </Text>
          </FlexColumn>
        </FlexColumn>
      </FlexRow>
      <FlexColumn
        align="flex-end"
      >
        <FlexColumn
          style={{gap: 0}}
          align="flex-end"
        >
          <Text
            size={15}
            weight={500}
            color={COLORS.taupe}
          >
            { email }
          </Text>
          <Text
            size={15}
            weight={500}
            color={COLORS.taupe}
          >
            { phone }
          </Text>
        </FlexColumn>
        <FaTrashAlt 
          color={COLORS.red}
          size={20}
          style={{cursor: "pointer"}}
          onClick={() => onDeleteClick(id)}
        />
      </FlexColumn>
    </FlexRow>
  );
}

export default Message;
