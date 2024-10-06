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
              Adelanto
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
            >
              Pendiente
            </Text>
          </th>
          <th>
            <Text
              align="start"
              weight={600}
              color={COLORS.gray}
            >
              Entrega
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
          vitroOrders.map((order, index) => {
            const parsedDate = new Date(order.finishDate);
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
                    width={190}
                    lines={1}
                    height="18px"
                    size={15}
                    color={COLORS.dim}
                    style={{textTransform: "capitalize"}}
                  >
                    { `${order.firstName.toLowerCase()} ${order.lastName?.toLowerCase()}` }
                  </TextDescription>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { order.phone }
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { order.document }
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
                    style={{whiteSpace: "nowrap"}}
                  >
                    S/. { order.total }
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                    style={{whiteSpace: "nowrap"}}
                  >
                    S/. { order.totalAdvance }
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                    style={{whiteSpace: "nowrap"}}
                  >
                    S/. { order.pending }
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                    style={{whiteSpace: "nowrap"}}
                  >
                    { 
                      !order.finishDate
                      ? "Por asignar"
                      : parsedDate.toLocaleDateString("ES-es", options)
                    }
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
