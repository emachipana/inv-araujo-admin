import { Table } from "reactstrap";
import { Container } from "../Products/styles";
import { Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import { useAdmin } from "../../../context/admin";
import { TextDescription } from "../../../components/Product/styles";
import { capitalize } from "../../../helpers/capitalize";

function List() {
  const { employees } = useAdmin();

  return (
    <Table
      css={Container}
      responsive
      hover
    >
      <thead>
        <tr>
          <th></th>
          <th>
            <Text
              align="start"
              weight={600}
              color={COLORS.gray}
            >
              Nombre
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
            >
              DNI
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
            >
              Teléfono
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
            >
              Correo
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
            >
              Cargo
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
              style={{whiteSpace: "nowrap"}}
            >
              Operaciones
            </Text>
          </th>
        </tr>
      </thead>
      <tbody>
        {    
          employees.map((employee, index) => (
            <tr key={index}>
              <td>
                <Text
                  size={15}
                  weight={500}
                  color={COLORS.dim}
                >
                  { index + 1 }
                </Text>
              </td>
              <td>
                <TextDescription
                  width={250}
                  lines={1}
                  height="18px"
                  size={15}
                  color={COLORS.dim}
                  style={{textTransform: "capitalize"}}
                >
                  {employee.rsocial.toLowerCase()}
                </TextDescription>
              </td>
              <td>
                <Text
                  size={15}
                  weight={500}
                  color={COLORS.dim}
                >
                  { employee.document }
                </Text>
              </td>
              <td>
                <Text
                  size={15}
                  weight={500}
                  color={COLORS.dim}
                >
                  { employee.phone }
                </Text>
              </td>
              <td>
                <Text
                  size={15}
                  weight={500}
                  color={COLORS.dim}
                >
                  { employee.email }
                </Text>
              </td>
              <td>
                <Text
                  size={15}
                  weight={500}
                  color={COLORS.dim}
                >
                  { capitalize(employee.role?.toLowerCase()) }
                </Text>
              </td>
              <td>
                <Text
                  size={15}
                  weight={500}
                  color={COLORS.dim}
                >
                  { 0 }
                </Text>
              </td>
            </tr>
          ))
        }
      </tbody>
    </Table>
  );
}

export default List;
