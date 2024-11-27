import { useState } from "react";
import { useAdmin } from "../../../context/admin";
import { Variety } from "../InvitroOrder/styles";
import { Wrapper } from "../Product/styles";
import { FlexColumn, FlexRow, Image, Text } from "../../../styles/layout";
import { TextDescription } from "../../../components/Product/styles";
import { COLORS } from "../../../styles/colors";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa6";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Spinner } from "reactstrap";

function Item({ item, orderId, setOrder, handleEdit, orderStatus, isInvoiceGenerated }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteOrderItem, setError } = useAdmin();
  const { id, product, price, quantity, subTotal } = item;
  const { images = [] } = product;
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const updatedOrder = await deleteOrderItem(id, orderId);
      setOrder(updatedOrder);
      setIsDeleting(false);
    }catch(error) {
      setIsDeleting(false);
      console.error(error);
      setError(error.message);
    }
  }

  return (
    <Variety>
      <Wrapper>
        <FlexColumn gap={0.1}>
          <Text
            weight={700}
            size={15}
          >
            Producto
          </Text>
          <FlexRow>
            <Image
              width="25px"
              alt={product.name}
              src={(images && images[0]) ? images[0]?.image.url : "/img/default_product.png"}
            />
            <TextDescription
              lines={1}
              align="start"
              weight={600}
              size="14px"
              color={COLORS.dim}
            >
              { product.name }
            </TextDescription>
          </FlexRow>
        </FlexColumn>
        <FlexColumn gap={0.1}>
          <Text 
            weight={700}
            size={15}
          >
            Precio
          </Text>
          <Text
            weight={600}
            size={14}
            color={COLORS.dim}
          >
            S/. { price }
          </Text>
        </FlexColumn>
        <FlexColumn gap={0.1}>
          <Text 
            weight={700}
            size={15}
          >
            Cantidad
          </Text>
          <Text
            weight={600}
            size={14}
            color={COLORS.dim}
          >
            { quantity }
          </Text>
        </FlexColumn>
        <FlexColumn gap={0.1}>
          <Text 
            weight={700}
            size={15}
          >
            Subtotal
          </Text>
          <Text
            weight={600}
            size={14}
            color={COLORS.dim}
          >
            S/. { subTotal }
          </Text>
        </FlexColumn>
      </Wrapper>
      {
        (orderStatus === "PENDIENTE" && !isInvoiceGenerated)
        &&
        <Wrapper 
          isButtons
          justify="center"
        >
          <Button
            style={{padding: "0.3rem 0.6rem"}}
            iconSize={15}
            fontSize={14}
            Icon={FaEye}
            onClick={() => navigate(`/productos/${product.id}`)}
          >
            Ver producto
          </Button>
          <Button
            style={{padding: "0.3rem 0.6rem"}}
            iconSize={15}
            fontSize={14}
            Icon={FaEdit}
            color="warning"
            onClick={() => handleEdit(item)}
          >
            Editar
          </Button>
          <Button
            style={{padding: "0.3rem 0.6rem"}}
            iconSize={14}
            fontSize={14}
            Icon={isDeleting ? null : FaTrashAlt}
            color="danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {
              isDeleting
              ? <>
                  <Spinner size="sm" />
                  Eliminado...
                </>
              : "Eliminar"
            }
          </Button>
        </Wrapper>
      }
    </Variety>
  );
}

export default Item;
