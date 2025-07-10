import { capitalize, capitalizeAll } from "../../helpers/capitalize";
import { COLORS } from "../../styles/colors";
import { FlexColumn, FlexRow, Text } from "../../styles/layout";
import { Container, Name } from "./styles";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

function EmployeeCard({employee}) {
  const { rsocial, document, role, email, phone } = employee;
  // const navigate = useNavigate();
  // onClick={() => navigate(`/empleados/${id}`)}
  return (
    <Container>
      <FlexColumn width="100%">
        <FlexRow
          width="100%"
          justify="space-between"
        >
          <Text
            color={COLORS.taupe}
          >
            { document }
          </Text>
          <Text
            color={COLORS.taupe}
          >
            { capitalize(role.name.toLowerCase()) }
          </Text>
        </FlexRow>
        <Name>
          { capitalizeAll(rsocial.toLowerCase()) }
        </Name>
        <FlexRow>
          <MdEmail 
            color={COLORS.persian}
          />
          <Text
            isLink
            color={COLORS.taupe}
          >
            { email }
          </Text>
        </FlexRow>
        <FlexRow>
          <FaPhone 
            color={COLORS.persian}
          />
          <Text
            color={COLORS.taupe}
          >
            { phone }
          </Text>
        </FlexRow>
      </FlexColumn>
    </Container>
  );
}

export default EmployeeCard;
