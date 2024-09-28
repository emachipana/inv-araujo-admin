/** @jsxImportSource @emotion/react */
import { Table } from "reactstrap";
import { COLORS } from "../../../styles/colors";
import { TextDescription } from "../../../components/Product/styles";
import { FaEdit } from "react-icons/fa";
import { Container } from "./styles";
import Badge from "../../../components/Badge";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../context/admin";
import { FlexRow, Text, Image } from "../../../styles/layout";

function List() {
  const { products } = useAdmin();
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
              Nombre
            </Text>
          </th>
          <th>
            <Text
              align="start"
              weight={600}
              color={COLORS.gray}
            >
              Descripción
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
              align="start"
            >
              Precio
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
            >
              Descuento
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
            >
              Stock
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
            >
              Categoría
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
            >
              Marca
            </Text>
          </th>
          <th>
            <Text
              weight={600}
              color={COLORS.gray}
            >
              Estado
            </Text>
          </th>
          <th>
            
          </th>
        </tr>
      </thead>
      <tbody>
        {
          products.map((product, index) => {
            const { images = [] } = product;

            return (
              <tr key={index} onClick={() => navigate(`${product.id}`)}>
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
                  <FlexRow
                    gap={0.2}
                    width="180px"
                    justify="flex-start"
                  >
                    <Image
                        width="55px"
                        alt={`${product.name}`}
                        src={(images && images[0]) ? images[0]?.image.url : "/img/default_product.png"}                            
                    />
                    <TextDescription
                      lines={1}
                      height="18px"
                      size={15}
                      color={COLORS.dim}
                    >
                      { product.name }
                    </TextDescription>
                  </FlexRow>
                </td>
                <td>
                  <TextDescription
                    lines={3}
                    height="18px"
                    size={15}
                    color={COLORS.dim}
                  >
                    { product.description }
                  </TextDescription>
                </td>
                <td>
                <FlexRow>
                  <Text
                    size={15}
                    color={product.discount ? COLORS.taupe : COLORS.persian}
                    weight={500}
                    style={{
                      textDecoration: product.discount ? "line-through" : "none",
                      textWrap: "nowrap"
                    }}
                  >
                    S/. { product.price }
                  </Text>
                  {
                    product.discount
                    &&
                    <Text
                      size={15}
                      color={COLORS.orange}
                      weight={500}
                      style={{textWrap: "nowrap"}}
                    >
                      S/. { product.discount.price }
                    </Text>
                  }
                </FlexRow>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { product.discount ? `-${product.discount.percentage}` : 0 }%
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { product.stock }
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { product.category.name }
                  </Text>
                </td>
                <td>
                  <Text
                    size={15}
                    weight={500}
                    color={COLORS.dim}
                  >
                    { product.brand }
                  </Text>
                </td>
                <td>
                  <Badge color={product.active ? "primary" : "danger"}>
                    { product.active ? "activo" : "inactivo" }
                  </Badge>
                </td>
                <td>
                  <FaEdit
                    onClick={(event) => handleClick(event, product.id)}
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
