/** @jsxImportSource @emotion/react */
import { Table } from "reactstrap";
import { useAdmin } from "../../../context/admin";
import { useNavigate } from "react-router-dom";
import { Container } from "../Products/styles";
import { Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import { TextDescription } from "../../../components/Product/styles";
import { FaEdit } from "react-icons/fa";
import { handleClick } from "../Products/handlers";

function List() {
  const { invoices } = useAdmin();
  const navigate = useNavigate();

  // formula igv
  // total -> 10
  // base -> (total / 1.18).toFixed(10)
  // igv -> base * 0.18

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
              Razón social
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
              Tipo
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
            >
              Serie
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
            >
              Base
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
            >
              IGV
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
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          invoices.map((invoice, index) => {
            const base = (invoice.total / 1.18).toFixed(2);
            const igv = (parseFloat(base) * 0.18).toFixed(2);

            return (
              <tr
                key={index}
                onClick={() => navigate(`${invoice.id}`)}
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
                    width={220}
                    lines={1}
                    height="18px"
                    size={15}
                    color={COLORS.dim}
                    style={{textTransform: "capitalize"}}
                  >
                    { invoice.rsocial.toLowerCase() }
                  </TextDescription>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { invoice.document }
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { invoice.invoiceType }
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { !invoice.serie ? "No emitido" : invoice.serie }
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    S/. { base }
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    S/. { igv }
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    S/. { invoice.total.toFixed(2) }
                  </Text>
                </td>
                <td>
                  <FaEdit
                    onClick={(event) => invoice.isGenerated ? "" : handleClick(event, invoice.id, navigate)}
                    size={18}
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
