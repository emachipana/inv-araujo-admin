/** @jsxImportSource @emotion/react */
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../context/admin";
import { Table } from "reactstrap";
import { Container } from "../Products/styles";
import { Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import { TextDescription } from "../../../components/Product/styles";
import Badge from "../../../components/Badge";
import { FaEdit } from "react-icons/fa";

function List() {
  const { vitroOrders } = useAdmin();
  const navigate = useNavigate();

  const handleClick = (event, id) => {
    event.stopPropagation();
    navigate(`${id}/edit`);
  }

  return (
    <Table
      css={Container}
      responsive
      hover
    >
      <thead>
        <tr>
          <td></td>
          <td>
            <Text
              align="start"
              weight={600}
              color={COLORS.gray}
            >
              Cliente
            </Text>
          </td>
          <td>
            <Text
              align="start"
              weight={600}
              color={COLORS.gray}
            >
              Teléfono
            </Text>
          </td>
          <td>
            <Text
              align="start"
              weight={600}
              color={COLORS.gray}
            >
              Documento
            </Text>
          </td>
          <td>
            <Text
              align="start"
              weight={600}
              color={COLORS.gray}
            >
              Destino
            </Text>
          </td>
          <td>
            <Text
              align="start"
              weight={600}
              color={COLORS.gray}
            >
              Total
            </Text>
          </td>
          <td>
            <Text
              align="start"
              weight={600}
              color={COLORS.gray}
            >
              Adelanto
            </Text>
          </td>
          <td>
            <Text
              align="start"
              weight={600}
              color={COLORS.gray}
            >
              Pendiente
            </Text>
          </td>
          <td>
            <Text
              align="start"
              weight={600}
              color={COLORS.gray}
            >
              Entrega
            </Text>
          </td>
          <td>
            <Text
              align="start"
              weight={600}
              color={COLORS.gray}
            >
              Estado
            </Text>
          </td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {
          vitroOrders.map((order, index) => {
            const parsedDate = new Date(order.finishDate);
            const options = {
              day: "numeric",
              month: "short",
              year: "numeric"
            }

            return (
              <tr
                key={index}
                onClick={() => navigate(`${order.id}`)}
              >
                <th>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { index + 1 }
                  </Text>
                </th>
                <th>
                  <TextDescription
                    width={200}
                    lines={1}
                    height="18px"
                    size={15}
                    color={COLORS.dim}
                    style={{textTransform: "capitalize"}}
                  >
                    { `${order.firstName} ${order.lastName}` }
                  </TextDescription>
                </th>
                <th>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { order.phone }
                  </Text>
                </th>
                <th>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { order.document }
                  </Text>
                </th>
                <th>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { order.destination }
                  </Text>
                </th>
                <th>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    S/. { order.total }
                  </Text>
                </th>
                <th>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    S/. { order.advance }
                  </Text>
                </th>
                <th>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    S/. { order.pending }
                  </Text>
                </th>
                <th>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { parsedDate.toLocaleDateString("ES-es", options) }
                  </Text>
                </th>
                <th>
                  <Badge
                    color={order.status === "PENDIENTE" ? "warning" : (order.status === "CANCELADO" ? "danger" : "primary")}
                  >
                    { order.status }
                  </Badge>
                </th>
                <th>
                  <FaEdit
                    onClick={(event) => handleClick(event, order.id)}
                    size={20}
                    style={{cursor: "pointer"}}
                    color={COLORS.dim}
                  />
                </th>
              </tr>
            );
          })
        }
      </tbody>
    </Table>
  );
}

export default List;
