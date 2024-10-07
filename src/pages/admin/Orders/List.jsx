/** @jsxImportSource @emotion/react */
import { Table } from "reactstrap";
import { Container } from "../Products/styles";
import { useAdmin } from "../../../context/admin";
import { useNavigate } from "react-router-dom";
import { Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import { TextDescription } from "../../../components/Product/styles";
import Badge from "../../../components/Badge";
import { FaEdit } from "react-icons/fa";

function List() {
  const { orders } = useAdmin();
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

          <th></th>
          <th>
            <Text
              align="start"
              weight={600}
              color={COLORS.gray}
            >
              Cliente
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
              Documento
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
            >
              Destino
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
            >
              Total
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
            >
              Fecha pedido
            </Text>
          </th>
          <th>
            <Text
              align="start"
              weight={600}
              color={COLORS.gray}
            >
              Max. entrega
            </Text>
          </th>
          <th>
            <Text
              align="start"
              weight={600}
              color={COLORS.gray}
            >
              Estado
            </Text>
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          orders.map((order, index) => {
            const parsedShipDate = new Date(order.maxShipDate);
            const parsedDate = new Date(order.date);
            const options = {
              day: "numeric",
              month: "short",
              year: "numeric",
              timeZone: "UTC"
            }
            
            return (
              <tr 
                key={index}
                onClick={() => navigate(`${order.id}`)}
              >
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
                    width={200}
                    lines={1}
                    height="18px"
                    size={15}
                    color={COLORS.dim}
                    style={{textTransform: "capitalize"}}
                  >
                    { `${order.client.firstName?.toLowerCase()} ${order.client.lastName?.toLowerCase()}` }
                  </TextDescription>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { order.client.phone }
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { order.client.document }
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { order.city }
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    S/. { order.total }
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                    style={{textTransform: "capitalize"}}
                  >
                    { parsedDate.toLocaleDateString("ES-es", options) }
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { parsedShipDate.toLocaleDateString("ES-es", options) }
                  </Text>
                </td>
                <td>
                  <Badge
                    color={order.status === "PENDIENTE" ? "warning" : (order.status === "CANCELADO" ? "danger" : "primary")}
                  >
                    { order.status }
                  </Badge>
                </td>
                <td>
                  <FaEdit
                    onClick={(event) => handleClick(event, order.id)}
                    size={20}
                    style={{cursor: "pointer"}}
                    color={COLORS.dim}
                  />
                </td>
              </tr>
            );
          })
        }
      </tbody>
    </Table>
  );
}

export default List;
